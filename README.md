# 🚀 Zerodha Automated Trading Bot

A modern, full-stack automated trading bot for Zerodha with a beautiful UI. This application allows you to login with your Zerodha account, view your portfolio, and execute trades automatically.

## ✨ Features

- 🔐 **Secure Authentication**: Login with Zerodha API credentials
- 💰 **Balance Display**: View available balance, used margin, and total funds
- 📊 **Portfolio Management**: Track holdings, positions, and P&L
- 📈 **Trading Interface**: Place BUY/SELL orders with MARKET/LIMIT options
- 📋 **Order Management**: View and cancel orders in real-time
- 🔄 **Auto-Refresh**: Data refreshes automatically every 30 seconds
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔒 **Session Management**: Secure token storage and automatic session handling

## 🛠️ Technology Stack

**Backend:**
- Python 3.8+
- Flask (Web Framework)
- Kite Connect API (Zerodha Integration)
- Flask-Session (Session Management)
- Flask-CORS (Cross-Origin Resource Sharing)

**Frontend:**
- React 18
- React Router (Navigation)
- Axios (API Calls)
- Modern CSS3 (Styling)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- A Zerodha account with API access

### Getting Zerodha API Credentials

1. Visit [Kite Connect](https://kite.trade/)
2. Sign up for a developer account
3. Create a new app to get your API Key and API Secret
4. Note down your API Key and API Secret (you'll need these to login)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd workspace
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

## 🏃 Running the Application

You need to run both backend and frontend servers.

### Terminal 1: Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend server will start on `http://localhost:5000`

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📱 How to Use

### 1. **Initial Login**
   - Open `http://localhost:3000` in your browser
   - Enter your Zerodha API Key and API Secret
   - Click "Connect to Zerodha"
   - You'll be redirected to Zerodha's login page

### 2. **Zerodha Authentication**
   - Login with your Zerodha credentials
   - Enter your PIN
   - Complete 2FA authentication
   - You'll be redirected back to the app

### 3. **Dashboard**
   Once authenticated, you'll see:
   - **Balance Cards**: Available balance, holdings value, positions
   - **Trading Panel**: Place BUY/SELL orders
   - **Holdings Tab**: View all your stock holdings
   - **Positions Tab**: View open positions and day P&L
   - **Orders Tab**: View order history and cancel pending orders

### 4. **Placing Orders**
   - Navigate to the "Trading" tab
   - Enter the trading symbol (e.g., INFY, RELIANCE)
   - Select exchange (NSE/BSE)
   - Enter quantity
   - Choose order type (MARKET/LIMIT)
   - Select product type (CNC/MIS/NRML)
   - Click BUY or SELL button

### 5. **Session Management**
   - Your session remains active as long as the Zerodha access token is valid
   - Tokens typically expire at end of trading day
   - You'll need to re-authenticate the next trading day
   - Click "Logout" to clear your session

## 📁 Project Structure

```
workspace/
├── backend/
│   ├── app.py              # Flask application with all API routes
│   ├── requirements.txt    # Python dependencies
│   └── flask_session/      # Session data (auto-generated)
│
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js           # Login page component
│   │   │   ├── AuthCallback.js   # OAuth callback handler
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── TradingPanel.js   # Order placement form
│   │   │   ├── HoldingsTable.js  # Holdings display
│   │   │   ├── PositionsTable.js # Positions display
│   │   │   └── OrdersTable.js    # Orders display
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # npm dependencies
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/init` - Initialize with API credentials
- `POST /api/authenticate` - Authenticate with request token
- `GET /api/check-session` - Check if session is valid
- `POST /api/logout` - Logout and clear session

### Trading
- `GET /api/balance` - Get account balance and margins
- `GET /api/holdings` - Get user holdings
- `GET /api/positions` - Get open positions
- `GET /api/orders` - Get all orders
- `POST /api/place-order` - Place a new order
- `POST /api/cancel-order` - Cancel an order
- `POST /api/quote` - Get real-time quotes

## 🔒 Security Notes

- **API credentials** are stored only in session (not persisted to disk)
- **Access tokens** are managed securely using Flask-Session
- **CORS** is configured to only allow requests from the frontend
- Session expires automatically after 24 hours
- All sensitive operations require valid authentication

## ⚠️ Important Warnings

1. **Paper Trading First**: Test with small amounts or paper trading before live trading
2. **API Limits**: Zerodha has API rate limits - don't make too many requests
3. **Market Hours**: Trading is only allowed during market hours (9:15 AM - 3:30 PM IST)
4. **Token Expiry**: Access tokens expire daily - you need to re-authenticate
5. **Risk Management**: Always use stop losses and proper position sizing
6. **Not Financial Advice**: This is a tool - use at your own risk

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'flask'`
```bash
# Make sure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

**Issue**: `Port 5000 already in use`
```bash
# Change port in app.py, line: app.run(debug=True, host='0.0.0.0', port=5001)
# Also update axios.defaults.baseURL in frontend/src/App.js
```

### Frontend Issues

**Issue**: `npm ERR! Cannot find module`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: CORS errors
```bash
# Make sure backend is running on port 5000
# Check CORS configuration in backend/app.py
```

### Authentication Issues

**Issue**: "Not authenticated" errors
- Make sure you completed the Zerodha login flow
- Check if your access token expired (re-login required)
- Clear browser cookies and try again

**Issue**: "Invalid API credentials"
- Double-check your API Key and Secret
- Ensure your Kite Connect app is active
- Check if you're using correct credentials

## 🎨 Customization

### Changing Theme Colors
Edit `frontend/src/index.css` and `frontend/src/App.css` to modify:
- Gradient backgrounds
- Button colors
- Card styles
- Animations

### Adding New Features
1. Add new API endpoint in `backend/app.py`
2. Create React component in `frontend/src/components/`
3. Add route in `frontend/src/App.js`
4. Update dashboard to include new feature

## 📊 Example Trading Symbols

- **Stocks**: INFY, TCS, RELIANCE, HDFCBANK, ICICIBANK, SBIN, TATASTEEL
- **Indices**: NIFTY, BANKNIFTY (for F&O)
- **Exchange**: Use NSE for most stocks, BSE for BSE-listed stocks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes. Use at your own risk.

## 🙏 Acknowledgments

- [Zerodha Kite Connect](https://kite.trade/) for the API
- React team for the amazing framework
- Flask team for the excellent web framework

## 💬 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review Zerodha's [API documentation](https://kite.trade/docs/connect/v3/)
3. Open an issue in the repository

---

**⚠️ Disclaimer**: This bot is for educational purposes only. Trading in financial markets involves risk. Always do your own research and trade responsibly. The creators are not responsible for any financial losses.

## 🎯 Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Happy Trading! 📈🚀
