@echo off
title PolyDoc AI Frontend
echo.
echo ===============================================
echo     PolyDoc AI - Frontend Development Server
echo ===============================================
echo.
echo Starting React + Vite development server...
echo.
echo Features:
echo   - Beautiful landing page with animations
echo   - Dark/Light mode theme toggle
echo   - Google Sign-In integration (requires Firebase config)
echo   - Document upload and AI chat interface
echo.
echo Frontend will be available at: http://localhost:3003
echo.
echo Note: If you see Firebase errors, they can be ignored
echo       for frontend development and demo purposes.
echo.

cd /d "Z:\polydoc-ai"
node_modules\.bin\vite --port 3003

echo.
echo Frontend server stopped.
pause
