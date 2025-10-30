@echo off
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║         KINGG RESTAURANT LEDGER - STARTING APPLICATION           ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart your computer
    echo 4. Run this file again
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js is installed
echo.
echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies... This may take 2-5 minutes.
    echo Please wait...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✓ Dependencies installed successfully!
)

echo.
echo ✓ All checks passed!
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                     STARTING APPLICATION...                      ║
echo ║                                                                   ║
echo ║  The app will open in your browser automatically.                ║
echo ║  If it doesn't open, go to: http://localhost:3000                ║
echo ║                                                                   ║
echo ║  LOGIN CREDENTIALS:                                              ║
echo ║  ID: KINGG                                                       ║
echo ║  Password: KINGG123                                              ║
echo ║                                                                   ║
echo ║  To stop the app: Press Ctrl+C in this window                    ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo Starting server...
echo.
call npm start
