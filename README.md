# 🤖 Zerodha Trading Bot

A modern, feature-rich Python-based automated trading bot for Zerodha with a beautiful web interface.

## ✨ Features

- 🔐 **Secure Authentication**: Login with API Key and Secret, with automatic token management
- 💰 **Real-time Balance**: View available balance, used margin, and total funds
- 📊 **Live Dashboard**: Modern, responsive UI with real-time data updates
- 📈 **Position Tracking**: Monitor all your open positions with live P&L
- 📝 **Order Management**: View recent orders and place new trades
- 🤖 **Auto Trading**: Enable/disable automated trading with a simple toggle
- 🔄 **Token Persistence**: Automatically saves and reuses valid tokens (valid until 6 AM IST next day)
- 📱 **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Zerodha account with API access ([Get API credentials](https://kite.trade/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the bot**
   ```bash
   python app.py
   ```

4. **Access the dashboard**
   Open your browser and go to: `http://localhost:5000`

## 📖 Usage Guide

### First Time Setup

1. **Get API Credentials**
   - Login to [Kite Connect](https://kite.trade/)
   - Create a new app to get your API Key and API Secret
   - Set the redirect URL to: `http://localhost:5000/callback`

2. **Login to the Bot**
   - Open the dashboard at `http://localhost:5000`
   - Enter your API Key and API Secret
   - Click "Connect to Zerodha"
   - You'll be redirected to Zerodha login page
   - Complete the login and authorize the app
   - You'll be redirected back to the dashboard

3. **Start Trading**
   - View your account balance and positions
   - Enable auto-trading with the toggle switch
   - Place manual orders using the order form
   - Monitor your positions and order history

### Token Management

The bot automatically manages your access tokens:
- Tokens are saved locally after successful authentication
- Valid tokens are automatically reused on app restart
- Tokens expire at 6 AM IST and need re-authentication
- You can manually logout to clear the token

### Trading Controls

**Manual Trading**
- Enter the stock symbol (e.g., INFY, RELIANCE)
- Specify quantity
- Choose order type (Market or Limit)
- Click Buy or Sell

**Auto Trading**
- Toggle the "Enable Auto Trading" switch
- Implement your trading strategy in the `ZerodhaBot` class
- The bot will execute trades automatically based on your strategy

## 🎨 Dashboard Features

### Balance Cards
- **Available Balance**: Shows your available margin for trading
- **Used Margin**: Displays currently used margin
- **Total Funds**: Net available funds

### Account Information
- User name and ID
- Email address
- Broker details

### Current Positions
- Real-time position tracking
- Live P&L for each position
- Average price and last traded price

### Recent Orders
- Last 10 orders displayed
- Order status and timestamps
- Buy/Sell indicators with color coding

## 🔧 Configuration

### Files Created

- `config.json`: Stores API credentials (automatically created)
- `token_data.json`: Stores access token and expiry (automatically created)

⚠️ **Important**: Add these files to `.gitignore` to keep your credentials secure!

### Security Best Practices

1. Never commit `config.json` or `token_data.json` to version control
2. Keep your API Secret confidential
3. Use a strong secret key for Flask sessions
4. Run the bot on a secure network
5. Regularly monitor your account for unauthorized access

## 🛠️ Customization

### Adding Auto-Trading Strategies

Edit the `ZerodhaBot` class in `app.py` to implement your trading logic:

```python
def auto_trade(self):
    """Implement your auto-trading strategy here"""
    if not self.trading_enabled:
        return
    
    # Example: Buy INFY if price drops below 1400
    # Add your trading logic here
    pass
```

### Styling

Modify the CSS in `templates/index.html` to customize the appearance:
- Change color scheme by modifying CSS variables
- Adjust card layouts and spacing
- Add new components as needed

## 📊 API Endpoints

- `GET /`: Main dashboard
- `POST /api/login`: Initialize login
- `GET /callback`: Handle Zerodha callback
- `GET /api/status`: Check authentication status
- `GET /api/profile`: Get user profile
- `GET /api/margins`: Get account margins
- `GET /api/positions`: Get current positions
- `GET /api/holdings`: Get holdings
- `GET /api/orders`: Get all orders
- `POST /api/place_order`: Place a new order
- `POST /api/toggle_trading`: Enable/disable trading
- `POST /api/logout`: Logout and clear tokens

## ⚠️ Disclaimer

**Important**: This is a trading bot that can execute real trades with real money. 

- Use at your own risk
- Test thoroughly with small amounts first
- Never invest more than you can afford to lose
- The developers are not responsible for any financial losses
- Always monitor your bot's activity
- Understand the risks involved in automated trading

## 🐛 Troubleshooting

### Token Expired
- Simply logout and login again
- Tokens expire daily at 6 AM IST

### API Errors
- Verify your API credentials are correct
- Check if your API key is active
- Ensure redirect URL matches in Kite Connect app settings

### Port Already in Use
- Change the port in `app.py`: `app.run(port=5001)`
- Or kill the process using port 5000

## 📝 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check Zerodha Kite Connect documentation
- Review the troubleshooting section

---

**Happy Trading! 📈🚀**

Remember: Past performance is not indicative of future results. Trade responsibly!
