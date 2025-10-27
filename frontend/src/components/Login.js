import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/init', {
        api_key: apiKey,
        api_secret: apiSecret
      });

      if (response.data.success) {
        // Redirect to Zerodha login
        window.location.href = response.data.login_url;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <h1>🚀 Zerodha Trading Bot</h1>
          <p>Enter your API credentials to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Zerodha API Key"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiSecret">API Secret</label>
            <input
              type="password"
              id="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter your API Secret"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connecting...' : 'Connect to Zerodha'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '13px', color: '#666' }}>
          <strong>Note:</strong> Your API credentials are used only to authenticate with Zerodha. 
          They are stored securely in your session and never saved permanently.
        </div>
      </div>
    </div>
  );
}

export default Login;
