@echo off
echo Starting Zerodha Trading Bot...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Setup Backend
echo Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Start backend server in a new window
echo Starting Backend Server on port 5000...
start "Backend Server" cmd /k "venv\Scripts\activate.bat && python app.py"

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend

REM Install Node dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
)

REM Start frontend development server in a new window
echo Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "npm run dev"

cd ..

echo.
echo Application Started Successfully!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Close the server windows to stop the application.
pause
