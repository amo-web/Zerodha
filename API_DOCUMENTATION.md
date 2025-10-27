# API Documentation 📚

Complete API reference for the Zerodha Trading Bot backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require an active session with a valid Zerodha access token. The token is automatically managed by the backend and stored in `tokens.json`.

---

## Endpoints

### 1. Initialize Connection

Initialize the Kite Connect API with your credentials.

**Endpoint:** `POST /api/init`

**Request Body:**
```json
{
  "api_key": "your_api_key",
  "api_secret": "your_api_secret"
}
```

**Response (Need Login):**
```json
{
  "status": "need_login",
  "login_url": "https://kite.zerodha.com/connect/login?api_key=..."
}
```

**Response (Already Authenticated):**
```json
{
  "status": "authenticated",
  "login_url": null,
  "profile": {
    "user_id": "XX1234",
    "user_name": "John Doe",
    "email": "john@example.com",
    "user_type": "individual",
    "broker": "ZERODHA"
  }
}
```

**Error Response:**
```json
{
  "error": "API key and secret required"
}
```

---

### 2. OAuth Callback

Exchange request token for access token after Zerodha login.

**Endpoint:** `POST /api/callback`

**Request Body:**
```json
{
  "request_token": "xxx"
}
```

**Response:**
```json
{
  "status": "success",
  "profile": {
    "user_id": "XX1234",
    "user_name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response:**
```json
{
  "error": "Request token required"
}
```

---

### 3. Get Balance

Retrieve account balance, margins, positions, and holdings.

**Endpoint:** `GET /api/balance`

**Authentication:** Required

**Response:**
```json
{
  "margins": {
    "equity": {
      "enabled": true,
      "net": 50000.50,
      "available": {
        "adhoc_margin": 0,
        "cash": 48000.50,
        "collateral": 0,
        "intraday_payin": 0
      },
      "utilised": {
        "debits": 2000.00,
        "exposure": 0,
        "m2m_realised": 0,
        "m2m_unrealised": 0,
        "option_premium": 0,
        "payout": 0,
        "span": 2000.00,
        "holding_sales": 0,
        "turnover": 0
      }
    },
    "commodity": {
      "enabled": true,
      "net": 10000.00,
      "available": {
        "cash": 10000.00
      },
      "utilised": {
        "debits": 0
      }
    }
  },
  "positions": {
    "net": [
      {
        "tradingsymbol": "INFY",
        "exchange": "NSE",
        "instrument_token": 408065,
        "product": "CNC",
        "quantity": 10,
        "overnight_quantity": 10,
        "multiplier": 1,
        "average_price": 1500.50,
        "close_price": 1490.00,
        "last_price": 1505.25,
        "value": 15005.00,
        "pnl": 47.50,
        "m2m": 47.50,
        "unrealised": 47.50,
        "realised": 0,
        "buy_quantity": 10,
        "buy_price": 1500.50,
        "buy_value": 15005.00,
        "buy_m2m": 47.50,
        "sell_quantity": 0,
        "sell_price": 0,
        "sell_value": 0,
        "sell_m2m": 0,
        "day_buy_quantity": 0,
        "day_buy_price": 0,
        "day_buy_value": 0,
        "day_sell_quantity": 0,
        "day_sell_price": 0,
        "day_sell_value": 0
      }
    ],
    "day": []
  },
  "holdings": [
    {
      "tradingsymbol": "TCS",
      "exchange": "NSE",
      "instrument_token": 2953217,
      "isin": "INE467B01029",
      "product": "CNC",
      "quantity": 5,
      "t1_quantity": 0,
      "realised_quantity": 5,
      "average_price": 3200.00,
      "last_price": 3250.00,
      "close_price": 3245.00,
      "pnl": 250.00,
      "day_change": 5.00,
      "day_change_percentage": 0.15
    }
  ]
}
```

---

### 4. Get Profile

Retrieve user profile information.

**Endpoint:** `GET /api/profile`

**Authentication:** Required

**Response:**
```json
{
  "user_id": "XX1234",
  "user_name": "John Doe",
  "user_shortname": "John",
  "email": "john@example.com",
  "user_type": "individual",
  "broker": "ZERODHA",
  "exchanges": ["NSE", "BSE", "NFO", "CDS", "BFO", "MCX"],
  "products": ["CNC", "MIS", "NRML"],
  "order_types": ["MARKET", "LIMIT", "SL", "SL-M"],
  "avatar_url": null
}
```

---

### 5. Get Instruments

Retrieve list of tradeable instruments.

**Endpoint:** `GET /api/instruments?exchange=NSE`

**Authentication:** Required

**Query Parameters:**
- `exchange` (optional): Exchange name (NSE, BSE, NFO, etc.). Default: NSE

**Response:**
```json
[
  {
    "instrument_token": 408065,
    "exchange_token": 1594,
    "tradingsymbol": "INFY",
    "name": "INFOSYS LIMITED",
    "exchange": "NSE",
    "instrument_type": "EQ"
  },
  {
    "instrument_token": 2953217,
    "exchange_token": 11536,
    "tradingsymbol": "TCS",
    "name": "TATA CONSULTANCY SERVICES LIMITED",
    "exchange": "NSE",
    "instrument_type": "EQ"
  }
]
```

**Note:** Limited to first 100 instruments for demo purposes.

---

### 6. Place Order

Place a new trading order.

**Endpoint:** `POST /api/place_order`

**Authentication:** Required

**Request Body:**
```json
{
  "exchange": "NSE",
  "tradingsymbol": "INFY",
  "transaction_type": "BUY",
  "quantity": 1,
  "product": "CNC",
  "order_type": "MARKET",
  "variety": "regular"
}
```

**Request Parameters:**
- `exchange` (required): Exchange (NSE, BSE, NFO, etc.)
- `tradingsymbol` (required): Trading symbol
- `transaction_type` (required): BUY or SELL
- `quantity` (required): Number of shares
- `product` (optional): CNC, MIS, NRML. Default: MIS
- `order_type` (optional): MARKET, LIMIT, SL, SL-M. Default: MARKET
- `variety` (optional): regular, amo, co, iceberg. Default: regular
- `price` (required for LIMIT orders): Limit price
- `trigger_price` (required for SL orders): Trigger price

**Response:**
```json
{
  "status": "success",
  "order_id": "220224000000001"
}
```

**Error Response:**
```json
{
  "error": "Insufficient funds"
}
```

---

### 7. Get Orders

Retrieve all orders for the day.

**Endpoint:** `GET /api/orders`

**Authentication:** Required

**Response:**
```json
[
  {
    "order_id": "220224000000001",
    "exchange_order_id": "1100000000000001",
    "parent_order_id": null,
    "status": "COMPLETE",
    "status_message": null,
    "order_timestamp": "2024-02-22 09:15:30",
    "exchange_update_timestamp": "2024-02-22 09:15:31",
    "exchange_timestamp": "2024-02-22 09:15:31",
    "variety": "regular",
    "exchange": "NSE",
    "tradingsymbol": "INFY",
    "instrument_token": 408065,
    "order_type": "MARKET",
    "transaction_type": "BUY",
    "validity": "DAY",
    "product": "CNC",
    "quantity": 1,
    "disclosed_quantity": 0,
    "price": 0,
    "trigger_price": 0,
    "average_price": 1505.50,
    "filled_quantity": 1,
    "pending_quantity": 0,
    "cancelled_quantity": 0
  }
]
```

---

### 8. Logout

Logout and clear session.

**Endpoint:** `POST /api/logout`

**Authentication:** Required

**Response:**
```json
{
  "status": "success"
}
```

---

## Order Types

### MARKET
- Executes at best available price
- Fastest execution
- No price guarantee

### LIMIT
- Executes at specified price or better
- Requires `price` parameter
- May not execute if price not reached

### SL (Stop Loss)
- Triggers market order when price reaches trigger
- Requires `trigger_price` parameter
- Used for limiting losses

### SL-M (Stop Loss Market)
- Similar to SL but executes as market order
- Requires `trigger_price` parameter
- Guarantees execution after trigger

---

## Products

### CNC (Cash and Carry)
- Delivery trading
- Full payment required
- Holdings credited to demat

### MIS (Margin Intraday Square-off)
- Intraday trading with leverage
- Must be squared off by 3:20 PM
- Auto square-off by broker

### NRML (Normal)
- Carry forward positions
- Used for F&O trading
- Higher margin requirements

---

## Transaction Types

- **BUY**: Purchase securities
- **SELL**: Sell securities

---

## Exchanges

- **NSE**: National Stock Exchange (Equity)
- **BSE**: Bombay Stock Exchange (Equity)
- **NFO**: NSE Futures & Options
- **BFO**: BSE Futures & Options
- **CDS**: Currency Derivatives Segment
- **MCX**: Multi Commodity Exchange

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Invalid credentials |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limits

Zerodha API has the following rate limits:

- **Order placement**: 10 requests per second
- **Order modification**: 10 requests per second
- **Historical data**: 3 requests per second
- **Quote**: 1 request per second per instrument

**Note:** Exceeding rate limits may result in temporary IP ban.

---

## Websocket API (Coming Soon)

Real-time market data streaming using WebSockets:

```javascript
// Example implementation
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Market update:', data);
};
```

---

## Example Usage

### Python Example

```python
import requests

# Initialize
response = requests.post('http://localhost:5000/api/init', json={
    'api_key': 'your_api_key',
    'api_secret': 'your_api_secret'
})

# Get balance
response = requests.get('http://localhost:5000/api/balance')
balance = response.json()
print(f"Available cash: {balance['margins']['equity']['available']['cash']}")

# Place order
response = requests.post('http://localhost:5000/api/place_order', json={
    'exchange': 'NSE',
    'tradingsymbol': 'INFY',
    'transaction_type': 'BUY',
    'quantity': 1,
    'order_type': 'MARKET',
    'product': 'MIS'
})
print(f"Order ID: {response.json()['order_id']}")
```

### JavaScript Example

```javascript
// Initialize
const response = await fetch('http://localhost:5000/api/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
  })
});

// Get balance
const balanceResponse = await fetch('http://localhost:5000/api/balance');
const balance = await balanceResponse.json();
console.log('Available cash:', balance.margins.equity.available.cash);

// Place order
const orderResponse = await fetch('http://localhost:5000/api/place_order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    exchange: 'NSE',
    tradingsymbol: 'INFY',
    transaction_type: 'BUY',
    quantity: 1,
    order_type: 'MARKET',
    product: 'MIS'
  })
});
const order = await orderResponse.json();
console.log('Order ID:', order.order_id);
```

---

## Best Practices

1. **Always handle errors gracefully**
```python
try:
    response = requests.post('/api/place_order', json=order_data)
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"Order failed: {e}")
```

2. **Respect rate limits**
```python
import time
from ratelimit import limits, sleep_and_retry

@sleep_and_retry
@limits(calls=10, period=1)
def place_order(data):
    return requests.post('/api/place_order', json=data)
```

3. **Validate data before placing orders**
```python
def validate_order(order):
    assert order['quantity'] > 0, "Quantity must be positive"
    assert order['transaction_type'] in ['BUY', 'SELL']
    assert order['exchange'] in ['NSE', 'BSE', 'NFO']
```

4. **Use proper error logging**
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    response = place_order(order_data)
    logger.info(f"Order placed: {response.json()['order_id']}")
except Exception as e:
    logger.error(f"Order failed: {e}", exc_info=True)
```

---

## Support

For API issues:
- Zerodha Kite Connect: https://kite.trade/docs/connect/v3/
- Trading API Forum: https://tradingqna.com/

For application issues:
- Check logs in `backend/app.log`
- Review main [README.md](README.md)

---

**Disclaimer:** This is a demo API. Always test with small amounts first. Trading involves risk of loss.
