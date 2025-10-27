#!/usr/bin/env python3
"""
Zerodha Trading Bot Launcher
This script provides an easy way to launch the trading bot with proper configuration.
"""

import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import streamlit
        import pandas
        import numpy
        import requests
        import pyotp
        import cryptography
        import plotly
        from kiteconnect import KiteConnect
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def setup_environment():
    """Set up environment variables and configuration"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from template...")
        with open(env_example, 'r') as f:
            content = f.read()
        with open(env_file, 'w') as f:
            f.write(content)
        print("✅ .env file created. Please edit it with your API credentials.")
        return False
    
    return True

def launch_bot():
    """Launch the Streamlit bot"""
    print("🚀 Launching Zerodha Trading Bot...")
    print("📱 The bot will open in your default browser")
    print("🔗 URL: http://localhost:8501")
    print("⏹️  Press Ctrl+C to stop the bot")
    print("-" * 50)
    
    try:
        # Launch Streamlit
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "zerodha_bot.py",
            "--server.port", "8501",
            "--server.address", "0.0.0.0",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    except Exception as e:
        print(f"❌ Error launching bot: {e}")

def main():
    """Main launcher function"""
    print("=" * 60)
    print("📈 ZERODHA TRADING BOT LAUNCHER")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path("zerodha_bot.py").exists():
        print("❌ Error: zerodha_bot.py not found")
        print("Please run this script from the bot directory")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("\n⚠️  Please configure your .env file before running the bot")
        print("Edit .env with your Zerodha API credentials")
        sys.exit(1)
    
    # Launch bot
    launch_bot()

if __name__ == "__main__":
    main()