# 🚀 Quick Start Guide

Get your Zerodha Trading Bot up and running in 5 minutes!

## Step 1: Get Zerodha API Credentials

1. Go to [https://kite.trade/](https://kite.trade/)
2. Login with your Zerodha account
3. Click "Create new app"
4. Fill in the details:
   - **App name**: My Trading Bot (or any name you prefer)
   - **Redirect URL**: `http://localhost:5000/callback`
   - **Description**: Personal trading bot
5. Click "Create"
6. Note down your **API Key** and **API Secret**

## Step 2: Install Dependencies

### Option A: Using the run script (Recommended)
```bash
./run.sh
```

The script will:
- Create a virtual environment
- Install all dependencies
- Start the bot automatically

### Option B: Manual installation
```bash
# Install dependencies
pip install -r requirements.txt

# Run the bot
python app.py
```

## Step 3: Access the Dashboard

1. Open your browser
2. Go to: `http://localhost:5000`
3. You'll see the login page

## Step 4: Connect to Zerodha

1. Enter your **API Key** (from Step 1)
2. Enter your **API Secret** (from Step 1)
3. Click "Connect to Zerodha"
4. You'll be redirected to Zerodha's login page
5. Login with your Zerodha credentials
6. Authorize the app
7. You'll be redirected back to the dashboard

## Step 5: Start Trading!

### View Your Balance
- Available Balance (top left card)
- Used Margin (top middle card)
- Total Funds (top right card)

### Place a Manual Order
1. Scroll to "Trading Controls"
2. Enter stock symbol (e.g., `INFY`, `RELIANCE`)
3. Enter quantity (e.g., `10`)
4. Choose order type (Market or Limit)
5. For limit orders, enter price
6. Click "Buy" or "Sell"

### Enable Auto Trading
1. Toggle the "Enable Auto Trading" switch
2. Add your trading strategy in `app.py`
3. The bot will execute trades automatically

### Monitor Your Trades
- **Current Positions**: See all open positions with live P&L
- **Recent Orders**: View your last 10 orders

## Important Notes

⚠️ **Security**
- Never share your API Key and Secret
- The credentials are saved locally in `config.json`
- Tokens are saved in `token_data.json`
- Both files are in `.gitignore` for security

🔄 **Token Expiry**
- Zerodha tokens expire at 6 AM IST daily
- You'll need to login again after expiry
- The bot will automatically reuse valid tokens

🛑 **Stopping the Bot**
- Press `Ctrl+C` in the terminal
- Or simply close the terminal window

## Troubleshooting

### "Port 5000 already in use"
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port
# Edit app.py and change: app.run(port=5001)
```

### "Module not found"
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### "Invalid API credentials"
- Double check your API Key and Secret
- Make sure there are no extra spaces
- Verify the redirect URL is correct in Kite Connect

### "Token expired"
- Click "Logout" in the dashboard
- Login again with your credentials

## Next Steps

1. **Test with small amounts** first
2. **Monitor the bot** regularly
3. **Implement your trading strategy** in `app.py`
4. **Set up alerts** for important events
5. **Backup your strategy** code regularly

## Need Help?

- 📖 Read the full [README.md](README.md)
- 📚 Check [Zerodha Kite Connect Docs](https://kite.trade/docs/connect/v3/)
- 🐛 Report issues on GitHub

---

**Happy Trading! 📈**

Remember: Start small, test thoroughly, and never risk more than you can afford to lose.
