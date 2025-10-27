#!/usr/bin/env python3
"""
Setup script for Zerodha Trading Bot
This script helps set up the bot environment and install dependencies.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_banner():
    """Print setup banner"""
    print("=" * 60)
    print("📈 ZERODHA TRADING BOT SETUP")
    print("=" * 60)
    print()

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ["logs", "data", "config"]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"📁 Created directory: {directory}")

def setup_environment_file():
    """Set up environment file"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists():
        if env_example.exists():
            print("📝 Creating .env file from template...")
            with open(env_example, 'r') as f:
                content = f.read()
            with open(env_file, 'w') as f:
                f.write(content)
            print("✅ .env file created")
        else:
            print("⚠️  .env.example not found, creating basic .env file...")
            with open(env_file, 'w') as f:
                f.write("""# Zerodha API Credentials
ZERODHA_API_KEY=your_api_key_here
ZERODHA_API_SECRET=your_api_secret_here
ZERODHA_REDIRECT_URI=http://localhost:8501

# App Configuration
STREAMLIT_SERVER_PORT=8501
STREAMLIT_SERVER_ADDRESS=0.0.0.0
""")
            print("✅ Basic .env file created")
    else:
        print("✅ .env file already exists")

def create_gitignore():
    """Create .gitignore file"""
    gitignore_content = """# Environment variables
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Bot specific
bot_config.json
logs/
data/
config/
*.log

# Streamlit
.streamlit/
"""
    
    with open(".gitignore", 'w') as f:
        f.write(gitignore_content)
    print("✅ .gitignore file created")

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "=" * 60)
    print("🎉 SETUP COMPLETE!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. 📝 Edit .env file with your Zerodha API credentials")
    print("2. 🚀 Run the bot: python run_bot.py")
    print("3. 🌐 Open http://localhost:8501 in your browser")
    print()
    print("Getting API credentials:")
    print("1. Visit https://kite.trade/")
    print("2. Create a new app or use existing")
    print("3. Copy API Key and Secret to .env file")
    print()
    print("⚠️  Important:")
    print("- Keep your API credentials secure")
    print("- Test with small amounts first")
    print("- Monitor your trades regularly")
    print()

def main():
    """Main setup function"""
    print_banner()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Setup environment file
    setup_environment_file()
    
    # Create .gitignore
    create_gitignore()
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main()