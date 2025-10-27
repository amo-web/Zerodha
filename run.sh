#!/bin/bash

# Zerodha Trading Bot Launcher
echo "=========================================="
echo "🤖 Zerodha Trading Bot"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo ""
echo "=========================================="
echo "🚀 Starting Zerodha Trading Bot..."
echo "=========================================="
echo ""
echo "📊 Dashboard URL: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the bot"
echo ""

# Run the application
python app.py
