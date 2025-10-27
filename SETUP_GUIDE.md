# 📖 Detailed Setup Guide

This guide will walk you through setting up the Zerodha Trading Bot step-by-step.

## 🎯 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Python 3.8+ installed ([Download](https://www.python.org/downloads/))
- [ ] Node.js 16+ installed ([Download](https://nodejs.org/))
- [ ] A code editor (VS Code recommended)
- [ ] A terminal/command prompt
- [ ] Zerodha trading account
- [ ] Zerodha Kite Connect API credentials

## 📝 Step-by-Step Installation

### Part 1: Get Zerodha API Credentials

#### 1.1 Create Kite Connect Account

1. Visit https://kite.trade/
2. Click on "Sign up" or "Get started"
3. Fill in your details and verify your email
4. Login to your Kite Connect developer account

#### 1.2 Create API App

1. Go to "My Apps" section
2. Click "Create new app"
3. Fill in the details:
   - **App name**: Give it a name (e.g., "My Trading Bot")
   - **Redirect URL**: Enter `http://localhost:3000/auth/callback`
   - **Description**: Brief description of your app
4. Submit and wait for approval (usually instant for personal use)

#### 1.3 Get Your Credentials

1. Once approved, go to your app details
2. Note down:
   - **API Key** (looks like: `xxxxxxxxxxxxx`)
   - **API Secret** (looks like: `yyyyyyyyyyyyyyyy`)
3. Keep these secure - you'll need them to login

### Part 2: Setup Backend (Python/Flask)

#### 2.1 Open Terminal

```bash
# Navigate to project directory
cd /path/to/workspace

# Go to backend folder
cd backend
```

#### 2.2 Create Virtual Environment

**On Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

#### 2.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- kiteconnect (Zerodha API)
- Flask-CORS (for frontend communication)
- Flask-Session (session management)

#### 2.4 Verify Installation

```bash
python -c "import flask; import kiteconnect; print('Backend setup complete!')"
```

If no errors, you're good to go!

### Part 3: Setup Frontend (React)

#### 3.1 Open New Terminal

Keep the backend terminal open and open a new terminal window.

```bash
# Navigate to project directory
cd /path/to/workspace

# Go to frontend folder
cd frontend
```

#### 3.2 Install Node Dependencies

```bash
# Install all packages
npm install
```

This will install:
- React and React-DOM
- React Router (for navigation)
- Axios (for API calls)
- All necessary build tools

#### 3.3 Verify Installation

```bash
npm list react
```

Should show React version without errors.

### Part 4: Running the Application

#### 4.1 Start Backend Server

**In Terminal 1 (Backend):**

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

✅ Backend is running!

#### 4.2 Start Frontend Server

**In Terminal 2 (Frontend):**

```bash
cd frontend
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

✅ Frontend is running!

Your browser should automatically open to `http://localhost:3000`

### Part 5: First Time Login

#### 5.1 Enter API Credentials

1. You'll see the login page with a beautiful gradient background
2. Enter your **API Key** in the first field
3. Enter your **API Secret** in the second field
4. Click "Connect to Zerodha"

#### 5.2 Zerodha Authentication

You'll be redirected to Zerodha's official login page:

1. **Enter User ID**: Your Zerodha client ID
2. **Enter Password**: Your Zerodha password
3. **Enter PIN**: Your 4-digit PIN
4. **2FA**: Complete two-factor authentication (TOTP)
5. **Grant Permission**: Allow the app to access your account

#### 5.3 Redirect Back

After successful authentication:
- You'll be redirected to `http://localhost:3000/auth/callback`
- The app will generate and save your access token
- You'll automatically be redirected to the dashboard

#### 5.4 Dashboard Access

Now you can:
- ✅ View your account balance
- ✅ See your holdings and positions
- ✅ Place buy/sell orders
- ✅ Track your order history

## 🎮 Using the Bot

### Viewing Balance

The dashboard shows three cards at the top:
1. **Available Balance**: Cash available for trading
2. **Holdings**: Number of stocks you own
3. **Positions**: Open intraday/F&O positions

### Placing an Order

1. Click on "Trading" tab (default view)
2. Fill in the form:
   - **Trading Symbol**: Enter stock symbol (e.g., `INFY`, `RELIANCE`)
   - **Exchange**: Select NSE or BSE
   - **Quantity**: Number of shares
   - **Order Type**: MARKET (immediate) or LIMIT (at specific price)
   - **Product**: CNC (delivery), MIS (intraday), or NRML (F&O)
3. Click **BUY** button (green) or **SELL** button (red)
4. Order confirmation will appear
5. Check "Orders" tab to verify

### Managing Holdings

1. Click "Holdings" tab
2. View all your long-term investments
3. See current value and P&L for each stock
4. Total portfolio summary at bottom

### Managing Positions

1. Click "Positions" tab
2. View open intraday and F&O positions
3. See real-time P&L
4. Day P&L shows today's profit/loss

### Managing Orders

1. Click "Orders" tab
2. View all orders (pending, completed, rejected)
3. Cancel pending orders by clicking "Cancel" button
4. See order statistics at bottom

## 🔧 Configuration Options

### Changing Ports

**Backend Port (default: 5000):**

Edit `backend/app.py`, last line:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001
```

Then update `frontend/src/App.js`:
```javascript
axios.defaults.baseURL = 'http://localhost:5001';  // Match backend port
```

**Frontend Port (default: 3000):**

Create `frontend/.env`:
```
PORT=3001
```

### Auto-Refresh Interval

Edit `frontend/src/components/Dashboard.js`:
```javascript
const interval = setInterval(fetchData, 30000);  // 30 seconds (change as needed)
```

### Session Timeout

Edit `backend/app.py`:
```python
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)  # Change duration
```

## 🆘 Common Issues & Solutions

### Issue 1: "Command not found: python3"

**Solution:**
```bash
# Try without the '3'
python --version

# Or install Python 3
# Mac: brew install python3
# Ubuntu: sudo apt install python3
# Windows: Download from python.org
```

### Issue 2: "npm: command not found"

**Solution:**
Download and install Node.js from https://nodejs.org/

### Issue 3: "Port 5000 is already in use"

**Solution:**
```bash
# Find and kill process on port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change the port (see Configuration Options above)

### Issue 4: CORS Error

**Solution:**
- Make sure backend is running on port 5000
- Check that `axios.defaults.baseURL` in `App.js` matches backend URL
- Clear browser cache and try again

### Issue 5: "Session expired" or "Not authenticated"

**Solution:**
- Zerodha tokens expire daily
- Click "Logout" and login again
- Complete the full authentication flow

### Issue 6: "Invalid API credentials"

**Solution:**
- Double-check API Key and Secret (no extra spaces)
- Ensure your Kite Connect app is approved
- Check if redirect URL is correct: `http://localhost:3000/auth/callback`

### Issue 7: Can't place order - "Insufficient funds"

**Solution:**
- Check available balance in dashboard
- Ensure you have enough margin for the trade
- For MIS orders, check intraday margin requirements

### Issue 8: Order rejected

**Possible reasons:**
- Trading symbol incorrect (check exact symbol on Zerodha)
- Market is closed (9:15 AM - 3:30 PM IST only)
- Insufficient margin
- Stock is in trade-to-trade segment
- Circuit limit hit

## 📞 Getting Help

### Check Logs

**Backend logs:**
Look at Terminal 1 where backend is running - errors will appear here

**Frontend logs:**
Press F12 in browser → Console tab → Check for errors

**Network logs:**
Press F12 → Network tab → Check API calls and responses

### Zerodha API Documentation

- Official docs: https://kite.trade/docs/connect/v3/
- Python library: https://github.com/zerodhatech/pykiteconnect
- Forum: https://kite.trade/forum/

### Debug Mode

Backend runs in debug mode by default - you'll see detailed error messages.

## ✅ Post-Setup Checklist

After setup, verify:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can access login page in browser
- [ ] Can login with API credentials
- [ ] Redirected to Zerodha successfully
- [ ] Dashboard loads with balance data
- [ ] Can place a test order (use small amount!)
- [ ] Can view holdings/positions
- [ ] Can view order history

## 🎓 Next Steps

1. **Test with small amounts** first
2. **Study the code** to understand how it works
3. **Customize the UI** to your preferences
4. **Add new features** like:
   - Automated trading strategies
   - Technical indicators
   - Price alerts
   - Portfolio analytics
   - Risk management rules

## 🎉 You're Ready!

Congratulations! Your Zerodha Trading Bot is now set up and running.

Remember:
- Start with small trades
- Always use stop losses
- Don't risk more than you can afford to lose
- This is a tool - you're responsible for your trading decisions

Happy Trading! 📈✨
