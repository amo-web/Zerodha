# Quick Start Guide 🚀

Get your Zerodha Trading Bot up and running in 5 minutes!

## Step 1: Get Zerodha API Credentials 🔑

1. Go to [Kite Connect](https://developers.kite.trade/)
2. Sign in with your Zerodha account
3. Create a new app
4. Note down your **API Key** and **API Secret**

## Step 2: Install Dependencies 📦

### Option A: Automatic Setup (Recommended)

#### On Linux/Mac:
```bash
./start.sh
```

#### On Windows:
```bash
start.bat
```

This will automatically:
- Set up Python virtual environment
- Install all dependencies
- Start both backend and frontend servers

### Option B: Manual Setup

#### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

## Step 3: Access the Application 🌐

1. Open your browser and go to: **http://localhost:3000**
2. Enter your Zerodha API Key and API Secret
3. Click "Connect to Zerodha"
4. Complete the Zerodha login in the popup window
5. Voila! Your dashboard is ready 🎉

## Features Overview 📊

### Dashboard Shows:
- ✅ Available balance (Equity & Commodity)
- ✅ Open positions with P&L
- ✅ Holdings
- ✅ Account information
- ✅ Auto-refresh every 30 seconds

### Token Management:
- ✅ Automatically saves your access token
- ✅ Reuses token until it expires (6 AM IST next day)
- ✅ No need to login repeatedly!

## Troubleshooting 🔧

### "Module not found" error
```bash
# Make sure you're in the correct directory and virtual environment is activated
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### "Port already in use"
```bash
# Kill the process using the port
# On Linux/Mac:
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Login popup blocked
- Allow popups for `localhost:3000` in your browser settings

### "Invalid API credentials"
- Double-check your API Key and Secret from Kite Connect dashboard
- Make sure there are no extra spaces

## Next Steps 🎯

1. **Add Trading Strategies**: Extend `backend/app.py` with your trading logic
2. **Customize UI**: Modify components in `frontend/src/components/`
3. **Add Alerts**: Implement notification system
4. **Backtesting**: Add historical data analysis

## Need Help? 💬

- Check the main [README.md](README.md) for detailed documentation
- Zerodha API docs: https://kite.trade/docs/connect/v3/
- Common issues: Check GitHub issues

## Security Reminder 🔒

- Never share your API credentials
- Don't commit `tokens.json` to version control
- Use small amounts for testing first

---

Happy Trading! 📈
