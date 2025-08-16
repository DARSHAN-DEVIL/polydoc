@echo off
title PolyDoc AI - Full Stack Development Server
echo.
echo ====================================
echo   PolyDoc AI - Full Stack Launcher
echo ====================================
echo.
echo Starting both Backend and Frontend servers...
echo.
echo Backend: Python API Server (FastAPI)
echo Frontend: React + Vite Development Server
echo.
echo Press Ctrl+C to stop both servers
echo.

cd /d "Z:\polydoc-ai"

:: Check if virtual environment exists for Python
if exist "venv\Scripts\activate.bat" (
    echo [INFO] Activating Python virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo [INFO] No virtual environment found, using system Python...
)

:: Start the Python backend in a new window
echo [INFO] Starting Python Backend Server...
start "PolyDoc AI Backend" cmd /c "python main.py || (echo Backend failed to start. Press any key to close... && pause >nul)"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start the React frontend in the current window
echo [INFO] Starting React Frontend Server...
echo [INFO] Frontend will be available at: http://localhost:3003
echo [INFO] Backend API will be available at: http://localhost:8000
echo.
echo Features Available:
echo   - Landing page with Google OAuth Sign-In
echo   - Protected dashboard with document upload  
echo   - Dark/Light mode theme toggle
echo   - AI document chat interface
echo   - Firestore database integration
echo.
echo IMPORTANT: Make sure Firebase is configured!
echo See FIREBASE-SETUP.md for setup instructions
echo.

node_modules\.bin\vite --port 3003

echo.
echo [INFO] Frontend server stopped.
echo [INFO] Backend server may still be running in the background.
pause
