from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from kiteconnect import KiteConnect
import os
import json
from datetime import datetime, timedelta
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
CORS(app, supports_credentials=True)

# File to store tokens
TOKEN_FILE = 'tokens.json'

# Global kite instance
kite = None
api_key = None

def load_tokens():
    """Load stored tokens from file"""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_tokens(data):
    """Save tokens to file"""
    with open(TOKEN_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def is_token_valid(token_data):
    """Check if stored token is still valid"""
    if not token_data or 'access_token' not in token_data:
        return False
    
    # Zerodha tokens expire at 6 AM IST daily
    # Check if token is from today
    if 'timestamp' in token_data:
        token_time = datetime.fromisoformat(token_data['timestamp'])
        current_time = datetime.now()
        
        # If token is from previous day, it's invalid
        if token_time.date() < current_time.date():
            return False
        
        # If it's past 6 AM today and token is from yesterday, it's invalid
        if current_time.hour >= 6 and token_time.date() < current_time.date():
            return False
    
    return True

@app.route('/api/init', methods=['POST'])
def initialize():
    """Initialize Kite Connect with API credentials"""
    global kite, api_key
    
    data = request.json
    api_key = data.get('api_key')
    api_secret = data.get('api_secret')
    
    if not api_key or not api_secret:
        return jsonify({'error': 'API key and secret required'}), 400
    
    # Store credentials in session
    session['api_key'] = api_key
    session['api_secret'] = api_secret
    
    # Initialize KiteConnect
    kite = KiteConnect(api_key=api_key)
    
    # Check if we have a valid stored token
    tokens = load_tokens()
    if api_key in tokens and is_token_valid(tokens[api_key]):
        try:
            kite.set_access_token(tokens[api_key]['access_token'])
            # Verify token by fetching profile
            profile = kite.profile()
            return jsonify({
                'status': 'authenticated',
                'login_url': None,
                'profile': profile
            })
        except Exception as e:
            # Token invalid, need fresh login
            pass
    
    # Generate login URL
    login_url = kite.login_url()
    
    return jsonify({
        'status': 'need_login',
        'login_url': login_url
    })

@app.route('/api/callback', methods=['POST'])
def callback():
    """Handle callback after Zerodha login"""
    global kite
    
    data = request.json
    request_token = data.get('request_token')
    
    if not request_token:
        return jsonify({'error': 'Request token required'}), 400
    
    api_key = session.get('api_key')
    api_secret = session.get('api_secret')
    
    if not api_key or not api_secret:
        return jsonify({'error': 'Session expired'}), 401
    
    try:
        # Generate access token
        data = kite.generate_session(request_token, api_secret=api_secret)
        access_token = data['access_token']
        
        # Set access token
        kite.set_access_token(access_token)
        
        # Store token with timestamp
        tokens = load_tokens()
        tokens[api_key] = {
            'access_token': access_token,
            'timestamp': datetime.now().isoformat()
        }
        save_tokens(tokens)
        
        # Get profile
        profile = kite.profile()
        
        return jsonify({
            'status': 'success',
            'profile': profile
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/balance', methods=['GET'])
def get_balance():
    """Get account balance and margins"""
    global kite
    
    if not kite:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        # Get margins for all segments
        margins = kite.margins()
        
        # Get positions
        positions = kite.positions()
        
        # Get holdings
        holdings = kite.holdings()
        
        return jsonify({
            'margins': margins,
            'positions': positions,
            'holdings': holdings
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    global kite
    
    if not kite:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        profile = kite.profile()
        return jsonify(profile)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/instruments', methods=['GET'])
def get_instruments():
    """Get list of instruments"""
    global kite
    
    if not kite:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        exchange = request.args.get('exchange', 'NSE')
        instruments = kite.instruments(exchange)
        
        # Convert to JSON serializable format
        instruments_list = []
        for inst in instruments[:100]:  # Limit to first 100 for demo
            instruments_list.append({
                'instrument_token': inst['instrument_token'],
                'exchange_token': inst['exchange_token'],
                'tradingsymbol': inst['tradingsymbol'],
                'name': inst['name'],
                'exchange': inst['exchange'],
                'instrument_type': inst['instrument_type']
            })
        
        return jsonify(instruments_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/place_order', methods=['POST'])
def place_order():
    """Place a trading order"""
    global kite
    
    if not kite:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    
    try:
        order_id = kite.place_order(
            variety=data.get('variety', kite.VARIETY_REGULAR),
            exchange=data['exchange'],
            tradingsymbol=data['tradingsymbol'],
            transaction_type=data['transaction_type'],
            quantity=data['quantity'],
            product=data.get('product', kite.PRODUCT_MIS),
            order_type=data.get('order_type', kite.ORDER_TYPE_MARKET)
        )
        
        return jsonify({
            'status': 'success',
            'order_id': order_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    global kite
    
    if not kite:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        orders = kite.orders()
        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout and clear session"""
    global kite, api_key
    
    kite = None
    api_key = None
    session.clear()
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
