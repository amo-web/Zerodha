@echo off
REM Zerodha Trading Bot - Quick Start Script for Windows
REM This script sets up and runs both backend and frontend

echo.
echo ========================================
echo   Zerodha Trading Bot - Quick Start
echo ========================================
echo.

REM Check Python
echo Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)
echo [OK] Python found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)
echo [OK] npm found
echo.

REM Setup backend
echo ========================================
echo Setting up backend...
echo ========================================
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo [OK] Backend setup complete
echo.

REM Setup frontend
echo ========================================
echo Setting up frontend...
echo ========================================
cd ..\frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
) else (
    echo [OK] npm dependencies already installed
)

echo [OK] Frontend setup complete
echo.

REM Start servers
echo ========================================
echo Starting servers...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop servers
echo.
pause

REM Start backend in new window
cd ..\backend
start "Zerodha Bot - Backend" cmd /k "venv\Scripts\activate.bat && python app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
cd ..\frontend
start "Zerodha Bot - Frontend" cmd /k "npm start"

echo.
echo ========================================
echo Both servers are starting...
echo Check the new windows that opened.
echo ========================================
echo.
pause
