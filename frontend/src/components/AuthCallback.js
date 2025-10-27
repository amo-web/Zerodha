import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function AuthCallback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');
  const [error, setError] = useState('');

  useEffect(() => {
    const requestToken = searchParams.get('request_token');
    const status = searchParams.get('status');

    if (status === 'success' && requestToken) {
      authenticateUser(requestToken);
    } else {
      setError('Authentication failed or was cancelled.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate]);

  const authenticateUser = async (requestToken) => {
    try {
      setStatus('Generating access token...');
      const response = await axios.post('/api/authenticate', {
        request_token: requestToken
      });

      if (response.data.success) {
        setStatus('Authentication successful! Redirecting...');
        onLogin();
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <h1>🔐 Authentication</h1>
        </div>

        {error ? (
          <div className="error-message">
            {error}
            <p style={{ marginTop: '10px', fontSize: '12px' }}>Redirecting to login...</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#666', fontSize: '16px' }}>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
