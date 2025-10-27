from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from kiteconnect import KiteConnect
import os
import json
import logging
from datetime import datetime, timedelta
import threading
import time

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Token storage file
TOKEN_FILE = 'token_data.json'
CONFIG_FILE = 'config.json'

class ZerodhaBot:
    def __init__(self):
        self.kite = None
        self.api_key = None
        self.api_secret = None
        self.access_token = None
        self.trading_enabled = False
        self.load_config()
        
    def load_config(self):
        """Load saved configuration and tokens"""
        try:
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, 'r') as f:
                    config = json.load(f)
                    self.api_key = config.get('api_key')
                    self.api_secret = config.get('api_secret')
                    
            if os.path.exists(TOKEN_FILE):
                with open(TOKEN_FILE, 'r') as f:
                    token_data = json.load(f)
                    self.access_token = token_data.get('access_token')
                    token_expiry = token_data.get('expiry')
                    
                    # Check if token is still valid
                    if token_expiry and datetime.fromisoformat(token_expiry) > datetime.now():
                        if self.api_key:
                            self.kite = KiteConnect(api_key=self.api_key)
                            self.kite.set_access_token(self.access_token)
                            logger.info("Loaded existing valid token")
                    else:
                        logger.info("Token expired, need to re-authenticate")
                        self.access_token = None
        except Exception as e:
            logger.error(f"Error loading config: {e}")
    
    def save_config(self):
        """Save API credentials"""
        try:
            config = {
                'api_key': self.api_key,
                'api_secret': self.api_secret
            }
            with open(CONFIG_FILE, 'w') as f:
                json.dump(config, f)
        except Exception as e:
            logger.error(f"Error saving config: {e}")
    
    def save_token(self, access_token):
        """Save access token with expiry"""
        try:
            # Zerodha tokens expire at 6 AM IST next day
            expiry = datetime.now() + timedelta(hours=18)  # Approximate expiry
            token_data = {
                'access_token': access_token,
                'expiry': expiry.isoformat()
            }
            with open(TOKEN_FILE, 'w') as f:
                json.dump(token_data, f)
            self.access_token = access_token
        except Exception as e:
            logger.error(f"Error saving token: {e}")
    
    def initialize_kite(self, api_key, api_secret):
        """Initialize Kite Connect with API credentials"""
        self.api_key = api_key
        self.api_secret = api_secret
        self.kite = KiteConnect(api_key=api_key)
        self.save_config()
        return self.kite.login_url()
    
    def generate_session(self, request_token):
        """Generate session using request token"""
        try:
            data = self.kite.generate_session(request_token, api_secret=self.api_secret)
            self.access_token = data["access_token"]
            self.kite.set_access_token(self.access_token)
            self.save_token(self.access_token)
            return True
        except Exception as e:
            logger.error(f"Error generating session: {e}")
            return False
    
    def get_profile(self):
        """Get user profile"""
        try:
            return self.kite.profile()
        except Exception as e:
            logger.error(f"Error fetching profile: {e}")
            return None
    
    def get_margins(self):
        """Get account margins/balance"""
        try:
            return self.kite.margins()
        except Exception as e:
            logger.error(f"Error fetching margins: {e}")
            return None
    
    def get_positions(self):
        """Get current positions"""
        try:
            return self.kite.positions()
        except Exception as e:
            logger.error(f"Error fetching positions: {e}")
            return None
    
    def get_holdings(self):
        """Get holdings"""
        try:
            return self.kite.holdings()
        except Exception as e:
            logger.error(f"Error fetching holdings: {e}")
            return None
    
    def place_order(self, tradingsymbol, exchange, transaction_type, quantity, order_type, price=None, product="MIS"):
        """Place an order"""
        try:
            if not self.trading_enabled:
                logger.warning("Trading is disabled")
                return {"error": "Trading is disabled"}
            
            order_params = {
                "tradingsymbol": tradingsymbol,
                "exchange": exchange,
                "transaction_type": transaction_type,
                "quantity": quantity,
                "order_type": order_type,
                "product": product
            }
            
            if price and order_type == "LIMIT":
                order_params["price"] = price
            
            order_id = self.kite.place_order(**order_params)
            return {"order_id": order_id, "status": "success"}
        except Exception as e:
            logger.error(f"Error placing order: {e}")
            return {"error": str(e)}
    
    def get_orders(self):
        """Get all orders"""
        try:
            return self.kite.orders()
        except Exception as e:
            logger.error(f"Error fetching orders: {e}")
            return None
    
    def is_authenticated(self):
        """Check if bot is authenticated"""
        return self.kite is not None and self.access_token is not None

# Initialize bot
bot = ZerodhaBot()

@app.route('/')
def index():
    """Main dashboard"""
    return render_template('index.html')

@app.route('/api/status')
def api_status():
    """Get authentication status"""
    return jsonify({
        'authenticated': bot.is_authenticated(),
        'trading_enabled': bot.trading_enabled
    })

@app.route('/api/login', methods=['POST'])
def api_login():
    """Initialize login with API credentials"""
    data = request.json
    api_key = data.get('api_key')
    api_secret = data.get('api_secret')
    
    if not api_key or not api_secret:
        return jsonify({'error': 'API key and secret required'}), 400
    
    try:
        login_url = bot.initialize_kite(api_key, api_secret)
        return jsonify({'login_url': login_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/callback')
def callback():
    """Handle Zerodha callback after login"""
    request_token = request.args.get('request_token')
    
    if not request_token:
        return "Error: No request token received", 400
    
    if bot.generate_session(request_token):
        return redirect('/')
    else:
        return "Error: Failed to generate session", 500

@app.route('/api/profile')
def api_profile():
    """Get user profile"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    profile = bot.get_profile()
    if profile:
        return jsonify(profile)
    return jsonify({'error': 'Failed to fetch profile'}), 500

@app.route('/api/margins')
def api_margins():
    """Get account margins"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    margins = bot.get_margins()
    if margins:
        return jsonify(margins)
    return jsonify({'error': 'Failed to fetch margins'}), 500

@app.route('/api/positions')
def api_positions():
    """Get current positions"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    positions = bot.get_positions()
    if positions:
        return jsonify(positions)
    return jsonify({'error': 'Failed to fetch positions'}), 500

@app.route('/api/holdings')
def api_holdings():
    """Get holdings"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    holdings = bot.get_holdings()
    if holdings:
        return jsonify(holdings)
    return jsonify({'error': 'Failed to fetch holdings'}), 500

@app.route('/api/orders')
def api_orders():
    """Get all orders"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    orders = bot.get_orders()
    if orders:
        return jsonify(orders)
    return jsonify({'error': 'Failed to fetch orders'}), 500

@app.route('/api/place_order', methods=['POST'])
def api_place_order():
    """Place an order"""
    if not bot.is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    result = bot.place_order(
        tradingsymbol=data.get('tradingsymbol'),
        exchange=data.get('exchange', 'NSE'),
        transaction_type=data.get('transaction_type'),
        quantity=data.get('quantity'),
        order_type=data.get('order_type', 'MARKET'),
        price=data.get('price'),
        product=data.get('product', 'MIS')
    )
    
    if 'error' in result:
        return jsonify(result), 400
    return jsonify(result)

@app.route('/api/toggle_trading', methods=['POST'])
def api_toggle_trading():
    """Enable/disable trading"""
    data = request.json
    bot.trading_enabled = data.get('enabled', False)
    return jsonify({'trading_enabled': bot.trading_enabled})

@app.route('/api/logout', methods=['POST'])
def api_logout():
    """Logout and clear tokens"""
    try:
        if os.path.exists(TOKEN_FILE):
            os.remove(TOKEN_FILE)
        bot.access_token = None
        bot.kite = None
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🤖 Zerodha Trading Bot Starting...")
    print("=" * 60)
    print(f"📊 Dashboard: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
