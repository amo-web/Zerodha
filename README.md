# Zerodha Trading Bot

A modern, automated trading bot for Zerodha with a beautiful React UI and secure OAuth authentication.

## Features

- 🔐 **Secure OAuth Authentication** - Login with your Zerodha API credentials
- 💰 **Real-time Balance Display** - View your available cash, collateral, and total balance
- 📊 **Portfolio Management** - Monitor holdings, positions, and order history
- 🚀 **Automated Trading** - Place buy/sell orders with various order types
- 🎨 **Modern UI** - Beautiful, responsive interface with glass morphism design
- ⚡ **Real-time Updates** - Auto-refresh data every 30 seconds
- 🔄 **Token Management** - Automatic token persistence and refresh

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Zerodha API credentials (API Key and API Secret)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zerodha-trading-bot
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   ZERODHA_API_KEY=your_api_key_here
   ZERODHA_API_SECRET=your_api_secret_here
   ZERODHA_REDIRECT_URI=http://localhost:3000/auth/callback
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## Usage

1. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - You'll see the login page

2. **Login Process**
   - Enter your Zerodha API Key and API Secret
   - Click "Connect to Zerodha"
   - A popup window will open for Zerodha OAuth authentication
   - Complete the authentication on Zerodha's website
   - The popup will close automatically and you'll be redirected to the dashboard

3. **Dashboard Features**
   - **Overview**: View your balance, holdings, and recent orders
   - **Trading**: Place new buy/sell orders with various order types
   - **Holdings**: Detailed view of your current holdings
   - **Orders**: Track all your placed orders
   - **Positions**: Monitor open positions

## API Endpoints

### Authentication
- `POST /api/auth/login-url` - Get Zerodha login URL
- `POST /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/logout/:apiKey` - Logout user

### User Data
- `GET /api/user/profile/:apiKey` - Get user profile and margins
- `GET /api/portfolio/holdings/:apiKey` - Get holdings
- `GET /api/portfolio/positions/:apiKey` - Get positions
- `GET /api/orders/:apiKey` - Get order book

### Trading
- `POST /api/orders/place/:apiKey` - Place new order

## Security Features

- OAuth 2.0 authentication with Zerodha
- Secure token storage and management
- API key validation
- Session timeout handling
- CORS protection

## Technology Stack

### Backend
- Node.js with Express
- Axios for API calls
- Crypto for checksum generation
- CORS for cross-origin requests

### Frontend
- React 18 with Hooks
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- React Hot Toast for notifications
- Axios for API communication

## Development

### Project Structure
```
zerodha-trading-bot/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   └── index.js
├── package.json
└── README.md
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run install-all` - Install all dependencies

## Important Notes

⚠️ **Security Warning**: This is a demo application. For production use:
- Implement proper database storage instead of in-memory storage
- Add rate limiting and request validation
- Implement proper error logging
- Add comprehensive input validation
- Use environment variables for all sensitive data

⚠️ **Trading Risk**: Trading involves financial risk. Use this bot responsibly and understand the risks involved.

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend is running on port 5000
   - Check that the frontend proxy is configured correctly

2. **Authentication Issues**
   - Verify your Zerodha API credentials
   - Check that the redirect URI matches your configuration
   - Ensure your Zerodha app has the correct permissions

3. **API Errors**
   - Check your internet connection
   - Verify that Zerodha's API is accessible
   - Check the browser console for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This software is for educational purposes only. The authors are not responsible for any financial losses incurred through the use of this software. Always trade responsibly and understand the risks involved.