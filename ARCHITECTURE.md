# 🏗️ Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                     (http://localhost:3000)                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               │ (CORS enabled)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend (Port 3000)                  │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  • Login.js          → API credential input                     │
│  • AuthCallback.js   → OAuth redirect handler                   │
│  • Dashboard.js      → Main dashboard with tabs                 │
│  • TradingPanel.js   → Order placement form                     │
│  • HoldingsTable.js  → Portfolio holdings display               │
│  • PositionsTable.js → Open positions display                   │
│  • OrdersTable.js    → Order history & management               │
│                                                                  │
│  Libraries:                                                      │
│  • React Router → Navigation                                    │
│  • Axios → API communication                                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ REST API
                               │ (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Flask Backend (Port 5000)                     │
├─────────────────────────────────────────────────────────────────┤
│  API Endpoints:                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Authentication                                          │    │
│  │  POST /api/init           → Initialize API              │    │
│  │  POST /api/authenticate   → Generate access token       │    │
│  │  GET  /api/check-session  → Verify session              │    │
│  │  POST /api/logout         → Clear session               │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Trading Operations                                      │    │
│  │  POST /api/place-order    → Place buy/sell order        │    │
│  │  POST /api/cancel-order   → Cancel pending order        │    │
│  │  POST /api/quote          → Get real-time quotes        │    │
│  └────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Data Retrieval                                          │    │
│  │  GET /api/balance         → Account margins & balance   │    │
│  │  GET /api/holdings        → User holdings               │    │
│  │  GET /api/positions       → Open positions              │    │
│  │  GET /api/orders          → Order history               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Middleware:                                                     │
│  • Flask-Session → Session management (filesystem)              │
│  • Flask-CORS → Cross-origin requests                           │
│                                                                  │
│  Session Storage:                                                │
│  • API Key, API Secret (temporary)                              │
│  • Access Token (persists until logout)                         │
│  • User ID                                                       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ Kite Connect API
                               │ (HTTPS)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Zerodha Kite Connect API                      │
│                      (api.kite.trade)                            │
├─────────────────────────────────────────────────────────────────┤
│  Services:                                                       │
│  • Authentication & OAuth                                        │
│  • Order placement & management                                 │
│  • Portfolio & holdings data                                    │
│  • Real-time market quotes                                      │
│  • Margin & balance information                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User enters API credentials
   │
   ▼
2. Backend generates Zerodha login URL
   │
   ▼
3. User redirected to Zerodha login page
   │
   ▼
4. User authenticates on Zerodha (User ID, Password, PIN, 2FA)
   │
   ▼
5. Zerodha redirects back with request_token
   │
   ▼
6. Backend exchanges request_token for access_token
   │
   ▼
7. Access token stored in session
   │
   ▼
8. User redirected to dashboard
   │
   ▼
9. All subsequent API calls use stored access_token
```

## Data Flow for Trading

```
User Action (Place Order)
   │
   ▼
TradingPanel.js
   │ Validates form data
   │ (symbol, quantity, price, etc.)
   ▼
axios.post('/api/place-order')
   │ Sends order details as JSON
   ▼
Flask Backend (app.py)
   │ Checks authentication
   │ Retrieves Kite instance from session
   │ Validates order parameters
   ▼
kite.place_order()
   │ Calls Zerodha API
   ▼
Zerodha Servers
   │ Validates order
   │ Places order on exchange
   │ Returns order_id
   ▼
Backend returns response
   │ { success: true, order_id: "xxx" }
   ▼
TradingPanel.js
   │ Shows success message
   │ Triggers dashboard refresh
   ▼
Dashboard updates order list
```

## Component Hierarchy

```
App.js
│
├─── Router
│    │
│    ├─── /login
│    │    └─── Login.js
│    │
│    ├─── /auth/callback
│    │    └─── AuthCallback.js
│    │
│    └─── /dashboard
│         └─── Dashboard.js
│              │
│              ├─── Balance Cards (3 cards)
│              │
│              └─── Tabbed Interface
│                   │
│                   ├─── Trading Tab
│                   │    └─── TradingPanel.js
│                   │
│                   ├─── Holdings Tab
│                   │    └─── HoldingsTable.js
│                   │
│                   ├─── Positions Tab
│                   │    └─── PositionsTable.js
│                   │
│                   └─── Orders Tab
│                        └─── OrdersTable.js
```

## Session Management

```
Session Lifecycle:
┌─────────────────────────────────────────────┐
│ 1. User logs in                             │
│    → API credentials sent to backend        │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ 2. Backend creates session                  │
│    → Stores: api_key, api_secret            │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ 3. User authenticates with Zerodha          │
│    → request_token received                 │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ 4. Backend generates access_token           │
│    → Adds to session: access_token, user_id │
│    → Creates KiteConnect instance           │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ 5. Session active (24 hours)                │
│    → All API calls use stored token         │
│    → Auto-refresh data every 30 seconds     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ 6. Session expires or user logs out         │
│    → Session cleared                        │
│    → User redirected to login               │
└─────────────────────────────────────────────┘
```

## Security Measures

### Backend Security
1. **Session Management**: Server-side sessions stored in filesystem
2. **CORS Protection**: Only frontend origin allowed
3. **No Persistent Storage**: API credentials not saved to database
4. **Token Isolation**: Each user session has isolated Kite instance
5. **Automatic Expiry**: Sessions expire after 24 hours

### Frontend Security
1. **HTTPS Recommended**: For production deployment
2. **No Credential Storage**: Credentials sent only once during login
3. **Session Cookies**: httpOnly cookies for session management
4. **Input Validation**: All form inputs validated before submission

### API Security
1. **Authentication Required**: All trading endpoints check session
2. **Rate Limiting**: Respects Zerodha's API rate limits
3. **Error Handling**: Sensitive errors not exposed to frontend
4. **Secure Redirect**: OAuth callback URL validated

## Technology Stack Details

### Backend Technologies
```
Python 3.8+
├── Flask 3.0.0           → Web framework
├── KiteConnect 4.2.0     → Zerodha API client
├── Flask-CORS 4.0.0      → Cross-origin requests
└── Flask-Session 0.5.0   → Session management
```

### Frontend Technologies
```
React 18.2.0
├── React Router 6.20.0   → Client-side routing
├── Axios 1.6.0           → HTTP client
└── Lucide React 0.292.0  → Icon library (optional)
```

## Deployment Architecture

### Development (Current)
```
localhost:3000 (Frontend) → localhost:5000 (Backend) → api.kite.trade
```

### Production (Recommended)
```
your-domain.com → Nginx Reverse Proxy
                    ├── /        → React (static build)
                    └── /api/*   → Flask backend
                                   → api.kite.trade
```

## Performance Considerations

1. **Auto-Refresh**: Dashboard refreshes every 30 seconds
2. **Parallel Requests**: Balance, holdings, positions, orders fetched in parallel
3. **Client-Side Caching**: React maintains state to reduce API calls
4. **Session Reuse**: Single session for multiple requests
5. **Lazy Loading**: Components loaded on-demand

## Scalability

### Current Limitations
- Single-user per session
- In-memory session storage
- No database (stateless except sessions)
- Manual order placement only

### Possible Enhancements
1. **Multi-user Support**: Add database for user management
2. **Automated Strategies**: Add strategy engine
3. **WebSocket Integration**: Real-time market data
4. **Redis Sessions**: For distributed deployment
5. **Background Workers**: For automated trading tasks
6. **MongoDB**: Store historical trades and analytics

## Error Handling

```
Frontend Error Flow:
User Action → Component → Axios Request
                             │
                     ┌───────┴────────┐
                     │                │
                  Success          Error
                     │                │
                     ▼                ▼
              Update UI      Display Error Message
                             (error-message class)

Backend Error Flow:
API Request → Endpoint → Authentication Check
                            │
                     ┌──────┴───────┐
                     │              │
                 Authenticated   Not Auth
                     │              │
                     ▼              └──→ 401 Unauthorized
              Business Logic
                     │
              ┌──────┴───────┐
              │              │
          Success        Exception
              │              │
              ▼              ▼
        Return JSON    Log Error + Return 500
        {success: true}  {error: "message"}
```

## File Structure

```
workspace/
│
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── venv/               # Virtual environment (ignored)
│   └── flask_session/      # Session storage (ignored)
│
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── AuthCallback.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TradingPanel.js
│   │   │   ├── HoldingsTable.js
│   │   │   ├── PositionsTable.js
│   │   │   └── OrdersTable.js
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # npm dependencies
│   ├── node_modules/       # npm packages (ignored)
│   └── build/              # Production build (ignored)
│
├── README.md               # Main documentation
├── SETUP_GUIDE.md          # Detailed setup instructions
├── QUICKSTART.md           # Quick start guide
├── ARCHITECTURE.md         # This file
├── start.sh                # Linux/Mac startup script
├── start.bat               # Windows startup script
└── .gitignore              # Git ignore rules
```

## API Rate Limits (Zerodha)

Zerodha enforces the following rate limits:
- **Order placement**: 10 requests/second
- **Order modification**: 10 requests/second
- **Market quotes**: 1 request/second
- **Historical data**: 3 requests/second

Our application respects these limits by:
1. Not implementing auto-refresh for quotes
2. 30-second auto-refresh for portfolio data
3. User-initiated actions only (no automated trading loops)

## Browser Compatibility

Tested and works on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires:
- JavaScript enabled
- Cookies enabled
- Local storage access

## Future Architecture Improvements

1. **Add WebSocket**: Real-time market data updates
2. **Redis Integration**: Distributed session management
3. **PostgreSQL**: User management and trade history
4. **Docker**: Containerized deployment
5. **Kubernetes**: Scalable cloud deployment
6. **Monitoring**: Add Prometheus + Grafana
7. **Logging**: Centralized logging with ELK stack
8. **CI/CD**: Automated testing and deployment

---

**This architecture is designed for:**
- ✅ Easy understanding and modification
- ✅ Security and session management
- ✅ Scalability for future enhancements
- ✅ Clean separation of concerns
