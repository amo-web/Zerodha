import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedApiKey = localStorage.getItem('zerodha_api_key');
    const storedAuth = localStorage.getItem('zerodha_auth');
    
    if (storedApiKey && storedAuth) {
      setApiKey(storedApiKey);
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedAuth));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (apiKey, apiSecret) => {
    try {
      setIsLoading(true);
      
      // Get login URL
      const response = await axios.post('/api/auth/login-url', {
        apiKey,
        apiSecret
      });
      
      const { loginUrl } = response.data;
      
      // Open Zerodha login in popup
      const popup = window.open(
        loginUrl,
        'zerodha-login',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      // Listen for popup completion
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Login cancelled'));
          }
        }, 1000);
        
        // Listen for message from popup
        const messageHandler = (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'ZERODHA_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            
            // Store authentication
            localStorage.setItem('zerodha_api_key', apiKey);
            localStorage.setItem('zerodha_auth', JSON.stringify(event.data.userData));
            
            setApiKey(apiKey);
            setIsAuthenticated(true);
            setUserData(event.data.userData);
            resolve(event.data);
          } else if (event.data.type === 'ZERODHA_AUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error));
          }
        };
        
        window.addEventListener('message', messageHandler);
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (apiKey) {
        await axios.post(`/api/auth/logout/${apiKey}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('zerodha_api_key');
      localStorage.removeItem('zerodha_auth');
      setApiKey(null);
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const refreshUserData = async () => {
    if (!apiKey) return;
    
    try {
      const response = await axios.get(`/api/user/profile/${apiKey}`);
      const userData = response.data;
      
      localStorage.setItem('zerodha_auth', JSON.stringify(userData));
      setUserData(userData);
      
      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      if (error.response?.status === 401) {
        // Token expired, logout
        logout();
      }
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    userData,
    apiKey,
    login,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};