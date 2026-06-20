@echo off
echo ===============================================================
echo            SafeNest - Fullstack Launcher Script
echo ===============================================================
echo.
echo This script will open two new terminal windows:
echo 1. The Python FastAPI backend server (Port 5000)
echo 2. The Vite React client (Port 5173)
echo.
echo Please keep this script open until both windows start.
echo.

:: Launch Python Backend
echo Launching backend server...
start "SafeNest Backend Server" cmd /k "cd backend && echo Installing dependencies... && pip install -r requirements.txt && echo Starting Uvicorn... && uvicorn main:app --reload --port 5000"

:: Launch Frontend Client
echo Launching frontend client...
start "SafeNest Frontend Client" cmd /k "cd frontend && echo Installing dependencies... && npm install && echo Starting dev server... && npm run dev"

echo.
echo Launcher tasks triggered. You can close this window now.
echo Open http://localhost:5173 in your web browser once ready.
echo.
pause
