const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (use database in production)
let userTokens = {};
let userCredentials = {};

// Zerodha API configuration
const ZERODHA_BASE_URL = 'https://api.kite.trade';
const ZERODHA_LOGIN_URL = 'https://kite.trade/connect/login';

// Generate checksum for API requests
function generateChecksum(apiKey, requestToken, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(apiKey + requestToken)
    .digest('hex');
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zerodha Trading Bot API is running' });
});

// Get login URL
app.post('/api/auth/login-url', (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ error: 'API Key and API Secret are required' });
    }

    // Store credentials temporarily
    userCredentials[apiKey] = { apiSecret };
    
    const loginUrl = `${ZERODHA_LOGIN_URL}?api_key=${apiKey}&redirect_url=${process.env.ZERODHA_REDIRECT_URI}`;
    
    res.json({ loginUrl });
  } catch (error) {
    console.error('Error generating login URL:', error);
    res.status(500).json({ error: 'Failed to generate login URL' });
  }
});

// Handle OAuth callback
app.post('/api/auth/callback', async (req, res) => {
  try {
    const { requestToken, apiKey } = req.body;
    
    if (!requestToken || !apiKey) {
      return res.status(400).json({ error: 'Request token and API key are required' });
    }

    const credentials = userCredentials[apiKey];
    if (!credentials) {
      return res.status(400).json({ error: 'Invalid API key' });
    }

    // Generate access token
    const checksum = generateChecksum(apiKey, requestToken, credentials.apiSecret);
    
    const response = await axios.post(`${ZERODHA_BASE_URL}/session/token`, {
      api_key: apiKey,
      request_token: requestToken,
      checksum: checksum
    });

    const { access_token, public_token } = response.data.data;
    
    // Store tokens
    userTokens[apiKey] = {
      accessToken: access_token,
      publicToken: public_token,
      timestamp: Date.now(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };

    // Clean up credentials
    delete userCredentials[apiKey];

    res.json({ 
      success: true, 
      message: 'Login successful',
      accessToken: access_token 
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: 'Failed to complete authentication' });
  }
});

// Get user profile and balance
app.get('/api/user/profile/:apiKey', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const tokens = userTokens[apiKey];
    
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if token is expired
    if (Date.now() > tokens.expiresAt) {
      delete userTokens[apiKey];
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }

    // Get user profile
    const profileResponse = await axios.get(`${ZERODHA_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`
      }
    });

    // Get user margins
    const marginsResponse = await axios.get(`${ZERODHA_BASE_URL}/user/margins`, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`
      }
    });

    res.json({
      profile: profileResponse.data.data,
      margins: marginsResponse.data.data
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Get holdings
app.get('/api/portfolio/holdings/:apiKey', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const tokens = userTokens[apiKey];
    
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const response = await axios.get(`${ZERODHA_BASE_URL}/portfolio/holdings`, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

// Place order
app.post('/api/orders/place/:apiKey', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const tokens = userTokens[apiKey];
    const orderData = req.body;
    
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const response = await axios.post(`${ZERODHA_BASE_URL}/orders/regular`, orderData, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get order book
app.get('/api/orders/:apiKey', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const tokens = userTokens[apiKey];
    
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const response = await axios.get(`${ZERODHA_BASE_URL}/orders`, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get positions
app.get('/api/portfolio/positions/:apiKey', async (req, res) => {
  try {
    const { apiKey } = req.params;
    const tokens = userTokens[apiKey];
    
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const response = await axios.get(`${ZERODHA_BASE_URL}/portfolio/positions`, {
      headers: {
        'Authorization': `token ${apiKey}:${tokens.accessToken}`
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Logout
app.post('/api/auth/logout/:apiKey', (req, res) => {
  const { apiKey } = req.params;
  delete userTokens[apiKey];
  res.json({ success: true, message: 'Logged out successfully' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});