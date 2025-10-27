# Zerodha Trading Bot 🚀

A modern, automated trading bot for Zerodha with a beautiful UI. This application allows you to login to your Zerodha account using API credentials, automatically preserves your session token, and displays your account balance, positions, and holdings in real-time.

## Features ✨

- 🔐 **Secure Authentication**: Login with Zerodha API key and secret
- 💾 **Token Persistence**: Automatically saves and reuses access tokens until they expire
- 💰 **Balance Display**: View available balance across Equity and Commodity segments
- 📊 **Positions & Holdings**: Monitor your open positions and holdings in real-time
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- 🔄 **Auto Refresh**: Automatically refreshes data every 30 seconds
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Prerequisites 📋

Before you begin, ensure you have:

- Python 3.8 or higher
- Node.js 16 or higher
- Zerodha Kite Connect API credentials (API Key and API Secret)
  - Get them from: https://developers.kite.trade/

## Installation 🛠️

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application 🚀

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage 📖

1. **Open the Application**: Navigate to `http://localhost:3000` in your browser

2. **Login**:
   - Enter your Zerodha API Key
   - Enter your Zerodha API Secret
   - Click "Connect to Zerodha"
   - A popup will open for Zerodha login
   - Complete the login process
   - The bot will automatically save your access token

3. **View Dashboard**:
   - See your available balance across different segments
   - Monitor open positions and their P&L
   - View your holdings
   - Refresh data anytime with the refresh button

4. **Auto-Trading**: The application is ready for implementing automated trading strategies (extend the backend with your trading logic)

## Token Management 🔑

- Access tokens are automatically saved in `backend/tokens.json`
- Tokens are valid until 6 AM IST the next day
- The bot automatically checks token validity and reuses valid tokens
- No need to login every time - just enter your credentials once!

## API Endpoints 🌐

### Backend API

- `POST /api/init` - Initialize connection with API credentials
- `POST /api/callback` - Handle Zerodha OAuth callback
- `GET /api/balance` - Get account balance and margins
- `GET /api/profile` - Get user profile
- `GET /api/instruments` - Get list of instruments
- `POST /api/place_order` - Place a trading order
- `GET /api/orders` - Get all orders
- `POST /api/logout` - Logout and clear session

## Project Structure 📁

```
zerodha-trading-bot/
├── backend/
│   ├── app.py              # Flask backend server
│   ├── requirements.txt    # Python dependencies
│   └── tokens.json         # Stored access tokens (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx   # Login page
│   │   │   └── Dashboard.jsx # Dashboard with balance
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

## Security Notes 🔒

- Never share your API Key and API Secret
- The `tokens.json` file contains sensitive data - keep it secure
- Don't commit `tokens.json` to version control (already in .gitignore)
- Use environment variables for production deployments

## Extending the Bot 🔧

To add automated trading strategies:

1. Edit `backend/app.py`
2. Add your trading logic in new endpoints
3. Call these endpoints from the frontend or set up scheduled tasks
4. Use the existing `place_order` endpoint as a template

Example trading logic:
```python
@app.route('/api/auto_trade', methods=['POST'])
def auto_trade():
    # Your trading logic here
    # Analyze market conditions
    # Place orders based on your strategy
    pass
```

## Tech Stack 💻

### Backend
- Flask - Web framework
- KiteConnect - Zerodha API wrapper
- Flask-CORS - Cross-origin resource sharing

### Frontend
- React - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client
- Lucide React - Icons

## Troubleshooting 🔧

### Backend Issues

- **Error: Module not found**: Make sure virtual environment is activated and dependencies are installed
- **Connection refused**: Ensure backend server is running on port 5000

### Frontend Issues

- **Port already in use**: Change port in `vite.config.js`
- **API errors**: Check if backend is running and CORS is configured correctly

### Authentication Issues

- **Invalid API credentials**: Verify your API Key and Secret from Kite Connect dashboard
- **Token expired**: The bot will automatically prompt for re-login when token expires
- **Login popup blocked**: Allow popups in your browser settings

## Contributing 🤝

Feel free to fork this project and add your own features! Some ideas:

- Add trading strategy builder UI
- Implement backtesting functionality
- Add charts and technical indicators
- Create notification system for trades
- Add support for multiple accounts

## Disclaimer ⚠️

This is a demo trading bot. Use at your own risk. Always test with small amounts first. Trading involves substantial risk of loss. The authors are not responsible for any financial losses.

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

For issues related to:
- Kite Connect API: Visit https://kite.trade/docs/connect/v3/
- This project: Open an issue on GitHub

---

Built with ❤️ for traders who love automation
