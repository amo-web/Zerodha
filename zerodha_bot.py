import streamlit as st
import pandas as pd
import numpy as np
import requests
import json
import time
import os
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px
from streamlit_option_menu import option_menu
from kiteconnect import KiteConnect
import pyotp
from cryptography.fernet import Fernet
import base64
import hashlib
from urllib.parse import urlparse, parse_qs
import webbrowser
from typing import Dict, List, Optional, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ZerodhaBot:
    def __init__(self):
        self.kite = None
        self.api_key = None
        self.api_secret = None
        self.access_token = None
        self.request_token = None
        self.encryption_key = None
        self.config_file = "bot_config.json"
        self.load_config()
        
    def load_config(self):
        """Load configuration from file"""
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                    self.api_key = config.get('api_key')
                    self.api_secret = config.get('api_secret')
                    self.access_token = config.get('access_token')
                    self.encryption_key = config.get('encryption_key')
                    
                    if self.access_token and self.api_key:
                        self.kite = KiteConnect(api_key=self.api_key)
                        self.kite.set_access_token(self.access_token)
            except Exception as e:
                logger.error(f"Error loading config: {e}")
    
    def save_config(self):
        """Save configuration to file"""
        config = {
            'api_key': self.api_key,
            'api_secret': self.api_secret,
            'access_token': self.access_token,
            'encryption_key': self.encryption_key
        }
        try:
            with open(self.config_file, 'w') as f:
                json.dump(config, f)
        except Exception as e:
            logger.error(f"Error saving config: {e}")
    
    def generate_encryption_key(self):
        """Generate encryption key for secure storage"""
        if not self.encryption_key:
            self.encryption_key = Fernet.generate_key().decode()
        return self.encryption_key
    
    def encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data"""
        key = self.generate_encryption_key()
        f = Fernet(key.encode())
        return f.encrypt(data.encode()).decode()
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        if not self.encryption_key:
            return encrypted_data
        try:
            f = Fernet(self.encryption_key.encode())
            return f.decrypt(encrypted_data.encode()).decode()
        except:
            return encrypted_data
    
    def authenticate(self, api_key: str, api_secret: str) -> bool:
        """Authenticate with Zerodha API"""
        try:
            self.api_key = api_key
            self.api_secret = api_secret
            self.kite = KiteConnect(api_key=api_key)
            
            # Generate login URL
            login_url = self.kite.login_url()
            
            # Save config
            self.save_config()
            
            return True
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return False
    
    def complete_authentication(self, request_token: str) -> bool:
        """Complete authentication with request token"""
        try:
            self.request_token = request_token
            data = self.kite.generate_session(request_token, api_secret=self.api_secret)
            self.access_token = data["access_token"]
            self.kite.set_access_token(self.access_token)
            
            # Save updated config
            self.save_config()
            
            return True
        except Exception as e:
            logger.error(f"Token generation error: {e}")
            return False
    
    def is_authenticated(self) -> bool:
        """Check if user is authenticated"""
        if not self.kite or not self.access_token:
            return False
        
        try:
            # Test API call
            profile = self.kite.profile()
            return True
        except:
            return False
    
    def get_profile(self) -> Dict:
        """Get user profile"""
        try:
            return self.kite.profile()
        except Exception as e:
            logger.error(f"Error getting profile: {e}")
            return {}
    
    def get_balance(self) -> Dict:
        """Get account balance"""
        try:
            return self.kite.margins()
        except Exception as e:
            logger.error(f"Error getting balance: {e}")
            return {}
    
    def get_positions(self) -> List[Dict]:
        """Get current positions"""
        try:
            return self.kite.positions()
        except Exception as e:
            logger.error(f"Error getting positions: {e}")
            return []
    
    def get_holdings(self) -> List[Dict]:
        """Get current holdings"""
        try:
            return self.kite.holdings()
        except Exception as e:
            logger.error(f"Error getting holdings: {e}")
            return []
    
    def get_orders(self) -> List[Dict]:
        """Get order history"""
        try:
            return self.kite.orders()
        except Exception as e:
            logger.error(f"Error getting orders: {e}")
            return []
    
    def place_order(self, variety: str, exchange: str, tradingsymbol: str, 
                   transaction_type: str, quantity: int, product: str, 
                   order_type: str, price: float = None) -> str:
        """Place an order"""
        try:
            order_id = self.kite.place_order(
                variety=variety,
                exchange=exchange,
                tradingsymbol=tradingsymbol,
                transaction_type=transaction_type,
                quantity=quantity,
                product=product,
                order_type=order_type,
                price=price
            )
            return order_id
        except Exception as e:
            logger.error(f"Error placing order: {e}")
            return None
    
    def cancel_order(self, variety: str, order_id: str) -> bool:
        """Cancel an order"""
        try:
            self.kite.cancel_order(variety=variety, order_id=order_id)
            return True
        except Exception as e:
            logger.error(f"Error cancelling order: {e}")
            return False
    
    def get_instruments(self, exchange: str = None) -> pd.DataFrame:
        """Get instruments list"""
        try:
            instruments = self.kite.instruments(exchange)
            return pd.DataFrame(instruments)
        except Exception as e:
            logger.error(f"Error getting instruments: {e}")
            return pd.DataFrame()
    
    def get_quote(self, instruments: List[str]) -> Dict:
        """Get quote for instruments"""
        try:
            return self.kite.quote(instruments)
        except Exception as e:
            logger.error(f"Error getting quote: {e}")
            return {}

def create_modern_ui():
    """Create modern Streamlit UI"""
    st.set_page_config(
        page_title="Zerodha Trading Bot",
        page_icon="📈",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Custom CSS for modern UI
    st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(90deg, #1f4e79 0%, #2e6da4 100%);
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        color: white;
        text-align: center;
    }
    
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin: 0.5rem 0;
        border-left: 4px solid #1f4e79;
    }
    
    .success-message {
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid #c3e6cb;
        margin: 1rem 0;
    }
    
    .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid #f5c6cb;
        margin: 1rem 0;
    }
    
    .info-message {
        background: #d1ecf1;
        color: #0c5460;
        padding: 1rem;
        border-radius: 5px;
        border: 1px solid #bee5eb;
        margin: 1rem 0;
    }
    
    .stButton > button {
        background: linear-gradient(90deg, #1f4e79 0%, #2e6da4 100%);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        font-weight: bold;
        transition: all 0.3s;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    .trading-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin: 1rem 0;
        border: 1px solid #e9ecef;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>📈 Zerodha Trading Bot</h1>
        <p>Automated Trading with Modern Interface</p>
    </div>
    """, unsafe_allow_html=True)
    
    return True

def main():
    """Main application function"""
    create_modern_ui()
    
    # Initialize bot
    if 'bot' not in st.session_state:
        st.session_state.bot = ZerodhaBot()
    
    bot = st.session_state.bot
    
    # Sidebar
    with st.sidebar:
        st.markdown("### 🔐 Authentication")
        
        if not bot.is_authenticated():
            st.markdown("**Login Required**")
            
            api_key = st.text_input("API Key", type="password", help="Enter your Zerodha API Key")
            api_secret = st.text_input("API Secret", type="password", help="Enter your Zerodha API Secret")
            
            if st.button("🔑 Authenticate", type="primary"):
                if api_key and api_secret:
                    if bot.authenticate(api_key, api_secret):
                        st.success("✅ Authentication successful!")
                        st.rerun()
                    else:
                        st.error("❌ Authentication failed!")
                else:
                    st.warning("⚠️ Please enter both API Key and API Secret")
            
            st.markdown("---")
            st.markdown("### 📋 Instructions")
            st.markdown("""
            1. Get your API credentials from Zerodha Developer Console
            2. Enter your API Key and Secret above
            3. Click Authenticate to proceed
            4. Complete the login process
            """)
            
        else:
            st.success("✅ Authenticated!")
            
            if st.button("🚪 Logout", type="secondary"):
                st.session_state.bot = ZerodhaBot()
                st.rerun()
    
    # Main content area
    if bot.is_authenticated():
        # Navigation menu
        selected = option_menu(
            menu_title=None,
            options=["Dashboard", "Trading", "Positions", "Orders", "Settings"],
            icons=["speedometer2", "graph-up", "briefcase", "list-ul", "gear"],
            menu_icon="cast",
            default_index=0,
            orientation="horizontal",
            styles={
                "container": {"padding": "0!important", "background-color": "#fafafa"},
                "icon": {"color": "#1f4e79", "font-size": "18px"},
                "nav-link": {
                    "font-size": "16px",
                    "text-align": "center",
                    "margin": "0px",
                    "--hover-color": "#eee"
                },
                "nav-link-selected": {"background-color": "#1f4e79"},
            }
        )
        
        if selected == "Dashboard":
            show_dashboard(bot)
        elif selected == "Trading":
            show_trading_interface(bot)
        elif selected == "Positions":
            show_positions(bot)
        elif selected == "Orders":
            show_orders(bot)
        elif selected == "Settings":
            show_settings(bot)
    
    else:
        # Show login instructions
        st.markdown("""
        <div class="info-message">
            <h3>🚀 Welcome to Zerodha Trading Bot</h3>
            <p>Please authenticate using your Zerodha API credentials in the sidebar to get started.</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Show features
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("""
            <div class="metric-card">
                <h4>🔐 Secure Authentication</h4>
                <p>Safe token management with encryption</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown("""
            <div class="metric-card">
                <h4>📊 Real-time Data</h4>
                <p>Live market data and portfolio tracking</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown("""
            <div class="metric-card">
                <h4>🤖 Automated Trading</h4>
                <p>Place and manage orders automatically</p>
            </div>
            """, unsafe_allow_html=True)

def show_dashboard(bot):
    """Show dashboard with account overview"""
    st.markdown("## 📊 Dashboard")
    
    # Get account data
    try:
        profile = bot.get_profile()
        balance = bot.get_balance()
        positions = bot.get_positions()
        holdings = bot.get_holdings()
        
        # Profile info
        if profile:
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown(f"""
                <div class="metric-card">
                    <h4>👤 User</h4>
                    <h3>{profile.get('user_name', 'N/A')}</h3>
                    <p>{profile.get('email', 'N/A')}</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.markdown(f"""
                <div class="metric-card">
                    <h4>🏦 Broker</h4>
                    <h3>{profile.get('broker', 'N/A')}</h3>
                    <p>User ID: {profile.get('user_id', 'N/A')}</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col3:
                st.markdown(f"""
                <div class="metric-card">
                    <h4>📅 Last Login</h4>
                    <h3>{datetime.now().strftime('%H:%M')}</h3>
                    <p>{datetime.now().strftime('%d %b %Y')}</p>
                </div>
                """, unsafe_allow_html=True)
        
        # Balance information
        if balance:
            st.markdown("### 💰 Account Balance")
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                available_cash = balance.get('equity', {}).get('available', {}).get('cash', 0)
                st.metric("Available Cash", f"₹{available_cash:,.2f}")
            
            with col2:
                total_value = balance.get('equity', {}).get('net', 0)
                st.metric("Total Value", f"₹{total_value:,.2f}")
            
            with col3:
                used_margin = balance.get('equity', {}).get('used', {}).get('total', 0)
                st.metric("Used Margin", f"₹{used_margin:,.2f}")
            
            with col4:
                available_margin = balance.get('equity', {}).get('available', {}).get('ad-hoc', 0)
                st.metric("Available Margin", f"₹{available_margin:,.2f}")
        
        # Holdings summary
        if holdings:
            st.markdown("### 📈 Current Holdings")
            
            if holdings:
                holdings_df = pd.DataFrame(holdings)
                holdings_df = holdings_df[['tradingsymbol', 'quantity', 'average_price', 'last_price', 'pnl']]
                holdings_df['pnl'] = holdings_df['pnl'].astype(float)
                holdings_df['pnl_color'] = holdings_df['pnl'].apply(lambda x: 'green' if x >= 0 else 'red')
                
                st.dataframe(
                    holdings_df,
                    use_container_width=True,
                    hide_index=True
                )
                
                # P&L Chart
                if len(holdings_df) > 0:
                    fig = px.bar(
                        holdings_df, 
                        x='tradingsymbol', 
                        y='pnl',
                        title="P&L by Symbol",
                        color='pnl',
                        color_continuous_scale=['red', 'green']
                    )
                    st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("No holdings found")
        
        # Recent positions
        if positions and positions.get('day'):
            st.markdown("### 📊 Day Positions")
            
            day_positions = positions['day']
            if day_positions:
                positions_df = pd.DataFrame(day_positions)
                st.dataframe(positions_df, use_container_width=True, hide_index=True)
            else:
                st.info("No day positions found")
        
    except Exception as e:
        st.error(f"Error loading dashboard data: {e}")

def show_trading_interface(bot):
    """Show trading interface"""
    st.markdown("## 🤖 Trading Interface")
    
    # Trading form
    with st.form("trading_form"):
        st.markdown("### Place New Order")
        
        col1, col2 = st.columns(2)
        
        with col1:
            variety = st.selectbox("Variety", ["regular", "amo", "iceberg", "auction"])
            exchange = st.selectbox("Exchange", ["NSE", "BSE", "NFO", "CDS", "MCX"])
            tradingsymbol = st.text_input("Trading Symbol", placeholder="RELIANCE")
            transaction_type = st.selectbox("Transaction Type", ["BUY", "SELL"])
            quantity = st.number_input("Quantity", min_value=1, value=1)
        
        with col2:
            product = st.selectbox("Product", ["CNC", "MIS", "NRML"])
            order_type = st.selectbox("Order Type", ["MARKET", "LIMIT", "SL", "SL-M"])
            price = st.number_input("Price", min_value=0.0, value=0.0, step=0.05) if order_type in ["LIMIT", "SL", "SL-M"] else None
            trigger_price = st.number_input("Trigger Price", min_value=0.0, value=0.0, step=0.05) if order_type in ["SL", "SL-M"] else None
        
        submitted = st.form_submit_button("📤 Place Order", type="primary")
        
        if submitted:
            if tradingsymbol and quantity > 0:
                try:
                    order_id = bot.place_order(
                        variety=variety,
                        exchange=exchange,
                        tradingsymbol=tradingsymbol,
                        transaction_type=transaction_type,
                        quantity=quantity,
                        product=product,
                        order_type=order_type,
                        price=price
                    )
                    
                    if order_id:
                        st.success(f"✅ Order placed successfully! Order ID: {order_id}")
                    else:
                        st.error("❌ Failed to place order")
                except Exception as e:
                    st.error(f"❌ Error placing order: {e}")
            else:
                st.warning("⚠️ Please fill in all required fields")
    
    # Quick actions
    st.markdown("### ⚡ Quick Actions")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📊 Get Quote", type="secondary"):
            symbol = st.text_input("Enter symbol for quote")
            if symbol:
                quote = bot.get_quote([f"NSE:{symbol}"])
                if quote:
                    st.json(quote)
    
    with col2:
        if st.button("📋 Search Instruments", type="secondary"):
            search_term = st.text_input("Search instruments")
            if search_term:
                instruments = bot.get_instruments()
                if not instruments.empty:
                    filtered = instruments[instruments['tradingsymbol'].str.contains(search_term, case=False)]
                    st.dataframe(filtered[['tradingsymbol', 'name', 'exchange']].head(10), use_container_width=True)
    
    with col3:
        if st.button("💰 Refresh Balance", type="secondary"):
            balance = bot.get_balance()
            if balance:
                st.success("Balance refreshed!")
                st.rerun()

def show_positions(bot):
    """Show current positions"""
    st.markdown("## 📊 Positions")
    
    try:
        positions = bot.get_positions()
        
        if positions:
            # Day positions
            if positions.get('day'):
                st.markdown("### 📈 Day Positions")
                day_positions = pd.DataFrame(positions['day'])
                if not day_positions.empty:
                    st.dataframe(day_positions, use_container_width=True, hide_index=True)
                else:
                    st.info("No day positions found")
            
            # Net positions
            if positions.get('net'):
                st.markdown("### 🏠 Net Positions")
                net_positions = pd.DataFrame(positions['net'])
                if not net_positions.empty:
                    st.dataframe(net_positions, use_container_width=True, hide_index=True)
                else:
                    st.info("No net positions found")
        else:
            st.info("No positions found")
    
    except Exception as e:
        st.error(f"Error loading positions: {e}")

def show_orders(bot):
    """Show order history"""
    st.markdown("## 📋 Orders")
    
    try:
        orders = bot.get_orders()
        
        if orders:
            orders_df = pd.DataFrame(orders)
            
            # Filter options
            col1, col2 = st.columns(2)
            
            with col1:
                status_filter = st.selectbox("Filter by Status", ["All"] + list(orders_df['status'].unique()))
            
            with col2:
                product_filter = st.selectbox("Filter by Product", ["All"] + list(orders_df['product'].unique()))
            
            # Apply filters
            filtered_orders = orders_df.copy()
            
            if status_filter != "All":
                filtered_orders = filtered_orders[filtered_orders['status'] == status_filter]
            
            if product_filter != "All":
                filtered_orders = filtered_orders[filtered_orders['product'] == product_filter]
            
            # Display orders
            st.dataframe(
                filtered_orders[['tradingsymbol', 'transaction_type', 'quantity', 'price', 'status', 'order_timestamp']],
                use_container_width=True,
                hide_index=True
            )
            
            # Order statistics
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                total_orders = len(orders_df)
                st.metric("Total Orders", total_orders)
            
            with col2:
                completed_orders = len(orders_df[orders_df['status'] == 'COMPLETE'])
                st.metric("Completed", completed_orders)
            
            with col3:
                pending_orders = len(orders_df[orders_df['status'].isin(['OPEN', 'TRIGGER PENDING'])])
                st.metric("Pending", pending_orders)
            
            with col4:
                cancelled_orders = len(orders_df[orders_df['status'] == 'CANCELLED'])
                st.metric("Cancelled", cancelled_orders)
        
        else:
            st.info("No orders found")
    
    except Exception as e:
        st.error(f"Error loading orders: {e}")

def show_settings(bot):
    """Show settings and configuration"""
    st.markdown("## ⚙️ Settings")
    
    # API Configuration
    st.markdown("### 🔐 API Configuration")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.text_input("API Key", value=bot.api_key or "", disabled=True)
    
    with col2:
        st.text_input("API Secret", value="*" * 20 if bot.api_secret else "", disabled=True)
    
    # Account Information
    st.markdown("### 👤 Account Information")
    
    try:
        profile = bot.get_profile()
        if profile:
            col1, col2 = st.columns(2)
            
            with col1:
                st.text_input("User Name", value=profile.get('user_name', ''), disabled=True)
                st.text_input("Email", value=profile.get('email', ''), disabled=True)
            
            with col2:
                st.text_input("User ID", value=profile.get('user_id', ''), disabled=True)
                st.text_input("Broker", value=profile.get('broker', ''), disabled=True)
    except:
        st.warning("Unable to load profile information")
    
    # Bot Status
    st.markdown("### 🤖 Bot Status")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        status = "🟢 Connected" if bot.is_authenticated() else "🔴 Disconnected"
        st.metric("Connection Status", status)
    
    with col2:
        st.metric("Last Update", datetime.now().strftime("%H:%M:%S"))
    
    with col3:
        if bot.access_token:
            st.metric("Token Status", "✅ Active")
        else:
            st.metric("Token Status", "❌ Inactive")
    
    # Actions
    st.markdown("### 🔄 Actions")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🔄 Refresh Data", type="primary"):
            st.rerun()
    
    with col2:
        if st.button("🗑️ Clear Cache", type="secondary"):
            if os.path.exists(bot.config_file):
                os.remove(bot.config_file)
            st.session_state.bot = ZerodhaBot()
            st.success("Cache cleared!")
            st.rerun()

if __name__ == "__main__":
    main()