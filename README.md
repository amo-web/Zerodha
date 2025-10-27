# 📈 Zerodha Trading Bot

A modern, secure Python-based trading bot for Zerodha with a beautiful web interface. This bot provides automated trading capabilities with real-time portfolio tracking and order management.

## ✨ Features

- 🔐 **Secure Authentication**: Encrypted storage of API credentials and tokens
- 📊 **Real-time Dashboard**: Live portfolio tracking with beautiful charts
- 🤖 **Automated Trading**: Place and manage orders with a modern interface
- 💰 **Balance Tracking**: Real-time account balance and margin information
- 📈 **Position Management**: Track day and net positions
- 📋 **Order History**: Complete order tracking and analytics
- 🎨 **Modern UI**: Beautiful, responsive web interface built with Streamlit
- 🔄 **Token Persistence**: Automatic token management and refresh

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Zerodha API credentials (API Key and Secret)
- Active Zerodha trading account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zerodha-trading-bot
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Zerodha API credentials
   ```

4. **Run the application**
   ```bash
   streamlit run zerodha_bot.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:8501`

## 🔧 Configuration

### Environment Variables

Create a `.env` file with your Zerodha API credentials:

```env
ZERODHA_API_KEY=your_api_key_here
ZERODHA_API_SECRET=your_api_secret_here
ZERODHA_REDIRECT_URI=http://localhost:8501
```

### Getting Zerodha API Credentials

1. Visit [Zerodha Developer Console](https://kite.trade/)
2. Create a new app or use existing app
3. Note down your API Key and Secret
4. Set the redirect URI to `http://localhost:8501`

## 📱 Usage

### First Time Setup

1. **Launch the application**
   - Run `streamlit run zerodha_bot.py`
   - Open `http://localhost:8501` in your browser

2. **Authenticate**
   - Enter your Zerodha API Key and Secret in the sidebar
   - Click "Authenticate" to generate login URL
   - Complete the login process on Zerodha's website
   - The bot will automatically save your access token

3. **Start Trading**
   - Navigate through the different sections using the top menu
   - View your dashboard, place orders, and manage positions

### Dashboard

- **Account Overview**: View your profile, balance, and account information
- **Holdings**: See current holdings with P&L visualization
- **Positions**: Track day and net positions
- **Real-time Data**: Live market data and portfolio updates

### Trading Interface

- **Place Orders**: Buy/sell stocks with various order types
- **Quick Actions**: Get quotes, search instruments, refresh data
- **Order Management**: View and manage your orders

### Security Features

- **Encrypted Storage**: All sensitive data is encrypted before storage
- **Token Management**: Automatic token refresh and persistence
- **Secure Authentication**: Safe handling of API credentials

## 🛠️ Technical Details

### Architecture

- **Backend**: Python with KiteConnect API
- **Frontend**: Streamlit with custom CSS styling
- **Security**: Fernet encryption for sensitive data
- **Data Storage**: JSON-based configuration with encryption

### Key Components

- `ZerodhaBot`: Main bot class handling API interactions
- `create_modern_ui()`: UI setup and styling
- `main()`: Application entry point and navigation
- Dashboard, Trading, Positions, Orders, Settings modules

### Dependencies

- `streamlit`: Web interface framework
- `kiteconnect`: Zerodha API client
- `pandas`: Data manipulation
- `plotly`: Interactive charts
- `cryptography`: Data encryption
- `pyotp`: OTP handling

## 🔒 Security

- All API credentials and tokens are encrypted using Fernet
- No sensitive data is stored in plain text
- Automatic token refresh prevents session expiry
- Secure configuration file management

## 📊 Features Overview

### Dashboard
- Real-time account balance
- Portfolio holdings with P&L
- Recent positions
- Account information

### Trading
- Place market and limit orders
- Support for all order types (MARKET, LIMIT, SL, SL-M)
- Quick quote lookup
- Instrument search

### Positions
- Day positions tracking
- Net positions overview
- Real-time P&L updates

### Orders
- Complete order history
- Order status tracking
- Filtering and search capabilities
- Order statistics

### Settings
- API configuration display
- Account information
- Bot status monitoring
- Cache management

## 🚨 Important Notes

- **Use at your own risk**: Trading involves financial risk
- **Test thoroughly**: Always test with small amounts first
- **Keep credentials secure**: Never share your API credentials
- **Monitor regularly**: Keep an eye on your positions and orders
- **Comply with regulations**: Ensure compliance with local trading regulations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please ensure compliance with Zerodha's terms of service and local regulations.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review error logs
3. Ensure API credentials are correct
4. Verify network connectivity

## 🔄 Updates

The bot automatically handles:
- Token refresh
- Session management
- Error recovery
- Data synchronization

---

**Disclaimer**: This software is for educational purposes only. Trading involves substantial risk of loss. The authors are not responsible for any financial losses incurred through the use of this software.