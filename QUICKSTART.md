# ⚡ Quick Start Guide

Get your Zerodha Trading Bot running in 3 simple steps!

## 🎯 Prerequisites

You need these installed on your computer:
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Zerodha API credentials** - [Get them here](https://kite.trade/)

## 🚀 Three Ways to Start

### Option 1: Automated Script (Recommended)

**On Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**On Windows:**
```bash
start.bat
```

The script will:
✅ Check prerequisites
✅ Install all dependencies
✅ Start both servers
✅ Open your browser automatically

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

### Option 3: Step-by-Step (First Time Users)

See the detailed [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete instructions.

## 🔑 First Login

1. Browser opens to `http://localhost:3000`
2. Enter your **API Key** and **API Secret** from Kite Connect
3. Click "Connect to Zerodha"
4. Login with your Zerodha credentials on their page
5. You'll be redirected back to the dashboard

## ✨ You're Ready!

Your trading bot is now running! You can:
- 💰 View your balance
- 📊 See your holdings
- 📈 Place buy/sell orders
- 📋 Track order history

## 🆘 Need Help?

- **Detailed Setup**: Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **All Features**: Check [README.md](README.md)
- **Troubleshooting**: See "Common Issues" section in setup guide

## ⚠️ Important Notes

1. **Test First**: Start with small amounts
2. **Market Hours**: Trading only works 9:15 AM - 3:30 PM IST
3. **Token Expiry**: Re-login daily (tokens expire)
4. **Risk Warning**: Trade responsibly

---

**Happy Trading! 🎉📈**
