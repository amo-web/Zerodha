import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import axios from 'axios'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const handleLogin = async (apiKey, apiSecret) => {
    setLoading(true)
    try {
      const response = await axios.post('/api/init', {
        api_key: apiKey,
        api_secret: apiSecret
      }, {
        withCredentials: true
      })

      if (response.data.status === 'authenticated') {
        setIsAuthenticated(true)
        setProfile(response.data.profile)
      } else if (response.data.status === 'need_login') {
        // Open Zerodha login in new window
        const loginWindow = window.open(
          response.data.login_url,
          'Zerodha Login',
          'width=600,height=700'
        )

        // Listen for the redirect with request token
        window.addEventListener('message', async (event) => {
          if (event.data.request_token) {
            loginWindow.close()
            
            // Exchange request token for access token
            const callbackResponse = await axios.post('/api/callback', {
              request_token: event.data.request_token
            }, {
              withCredentials: true
            })

            if (callbackResponse.data.status === 'success') {
              setIsAuthenticated(true)
              setProfile(callbackResponse.data.profile)
            }
          }
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true })
      setIsAuthenticated(false)
      setProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} loading={loading} />
      ) : (
        <Dashboard profile={profile} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
