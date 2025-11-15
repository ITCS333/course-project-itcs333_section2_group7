@echo off
REM start-server.bat
REM Helper script to install dependencies and start the Express server for Task 2

echo Checking Node.js / npm availability...

npm -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing npm dependencies (express)...
npm install

if errorlevel 1 (
    echo ERROR: npm install failed. Check output above.
    pause
    exit /b 1
)

echo.
echo Starting server (npm start). The server will listen on http://localhost:8000
echo.
npm start
