from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from kiteconnect import KiteConnect
import os
import json
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
Session(app)
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store Kite instances per session
kite_instances = {}

@app.route('/api/init', methods=['POST'])
def initialize():
    """Initialize Kite Connect with API key"""
    try:
        data = request.json
        api_key = data.get('api_key')
        api_secret = data.get('api_secret')
        
        if not api_key or not api_secret:
            return jsonify({'error': 'API key and secret are required'}), 400
        
        # Store credentials in session
        session['api_key'] = api_key
        session['api_secret'] = api_secret
        
        # Create Kite instance
        kite = KiteConnect(api_key=api_key)
        
        # Generate login URL
        login_url = kite.login_url()
        
        return jsonify({
            'success': True,
            'login_url': login_url
        })
    except Exception as e:
        logger.error(f"Initialization error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/authenticate', methods=['POST'])
def authenticate():
    """Authenticate with request token"""
    try:
        data = request.json
        request_token = data.get('request_token')
        
        api_key = session.get('api_key')
        api_secret = session.get('api_secret')
        
        if not api_key or not api_secret:
            return jsonify({'error': 'Not initialized. Please provide API credentials first.'}), 400
        
        if not request_token:
            return jsonify({'error': 'Request token is required'}), 400
        
        # Create Kite instance
        kite = KiteConnect(api_key=api_key)
        
        # Generate access token
        data = kite.generate_session(request_token, api_secret=api_secret)
        access_token = data['access_token']
        
        # Store access token
        session['access_token'] = access_token
        session['user_id'] = data.get('user_id')
        
        # Set access token
        kite.set_access_token(access_token)
        
        # Store kite instance
        session_id = session.sid
        kite_instances[session_id] = kite
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user_id': data.get('user_id')
        })
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-session', methods=['GET'])
def check_session():
    """Check if session is valid"""
    try:
        access_token = session.get('access_token')
        if not access_token:
            return jsonify({'authenticated': False})
        
        # Try to get profile to verify token
        kite = get_kite_instance()
        if not kite:
            return jsonify({'authenticated': False})
        
        profile = kite.profile()
        return jsonify({
            'authenticated': True,
            'user': profile
        })
    except Exception as e:
        logger.error(f"Session check error: {str(e)}")
        return jsonify({'authenticated': False})

@app.route('/api/balance', methods=['GET'])
def get_balance():
    """Get account balance and margins"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        margins = kite.margins()
        
        return jsonify({
            'success': True,
            'margins': margins
        })
    except Exception as e:
        logger.error(f"Balance error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/holdings', methods=['GET'])
def get_holdings():
    """Get user holdings"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        holdings = kite.holdings()
        
        return jsonify({
            'success': True,
            'holdings': holdings
        })
    except Exception as e:
        logger.error(f"Holdings error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/positions', methods=['GET'])
def get_positions():
    """Get user positions"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        positions = kite.positions()
        
        return jsonify({
            'success': True,
            'positions': positions
        })
    except Exception as e:
        logger.error(f"Positions error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        orders = kite.orders()
        
        return jsonify({
            'success': True,
            'orders': orders
        })
    except Exception as e:
        logger.error(f"Orders error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/place-order', methods=['POST'])
def place_order():
    """Place a new order"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        
        # Extract order parameters
        tradingsymbol = data.get('tradingsymbol')
        exchange = data.get('exchange', 'NSE')
        transaction_type = data.get('transaction_type')  # BUY or SELL
        quantity = data.get('quantity')
        order_type = data.get('order_type', 'MARKET')  # MARKET or LIMIT
        product = data.get('product', 'CNC')  # CNC, MIS, NRML
        price = data.get('price')
        
        # Validate required fields
        if not all([tradingsymbol, transaction_type, quantity]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Place order
        order_params = {
            'tradingsymbol': tradingsymbol,
            'exchange': exchange,
            'transaction_type': transaction_type,
            'quantity': int(quantity),
            'order_type': order_type,
            'product': product
        }
        
        if order_type == 'LIMIT' and price:
            order_params['price'] = float(price)
        
        order_id = kite.place_order(**order_params)
        
        return jsonify({
            'success': True,
            'order_id': order_id
        })
    except Exception as e:
        logger.error(f"Place order error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cancel-order', methods=['POST'])
def cancel_order():
    """Cancel an order"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        order_id = data.get('order_id')
        
        if not order_id:
            return jsonify({'error': 'Order ID is required'}), 400
        
        kite.cancel_order(variety='regular', order_id=order_id)
        
        return jsonify({
            'success': True
        })
    except Exception as e:
        logger.error(f"Cancel order error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/quote', methods=['POST'])
def get_quote():
    """Get quote for instruments"""
    try:
        kite = get_kite_instance()
        if not kite:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        instruments = data.get('instruments', [])
        
        if not instruments:
            return jsonify({'error': 'Instruments are required'}), 400
        
        quotes = kite.quote(instruments)
        
        return jsonify({
            'success': True,
            'quotes': quotes
        })
    except Exception as e:
        logger.error(f"Quote error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout and clear session"""
    try:
        session_id = session.sid
        if session_id in kite_instances:
            del kite_instances[session_id]
        
        session.clear()
        
        return jsonify({
            'success': True
        })
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_kite_instance():
    """Get Kite instance for current session"""
    try:
        session_id = session.sid
        
        if session_id in kite_instances:
            return kite_instances[session_id]
        
        # Recreate instance if not found
        api_key = session.get('api_key')
        access_token = session.get('access_token')
        
        if api_key and access_token:
            kite = KiteConnect(api_key=api_key)
            kite.set_access_token(access_token)
            kite_instances[session_id] = kite
            return kite
        
        return None
    except Exception as e:
        logger.error(f"Get kite instance error: {str(e)}")
        return None

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
