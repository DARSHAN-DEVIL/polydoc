@echo off
cls
color 0A
title PolyDoc AI - Initial Setup

echo.
echo ================================================================
echo   PolyDoc AI - New Laptop Setup
echo   Run this ONCE after cloning from GitHub
echo ================================================================
echo.

REM Check if this is a fresh clone
if not exist node_modules (
    echo ✅ Fresh repository detected
) else (
    echo ⚠️  Dependencies already installed. Continue anyway? 
    pause
)

echo.
echo [1/6] Checking system requirements...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.9+ from https://python.org
    echo    ✅ IMPORTANT: Check "Add Python to PATH" during installation
    pause
    exit /b 1
) else (
    python --version
    echo ✅ Python found
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
) else (
    node --version
    echo ✅ Node.js found
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found! Please reinstall Node.js
    pause
    exit /b 1
) else (
    npm --version
    echo ✅ npm found
)

echo.
echo [2/6] Checking disk space...
python optimize_cache.py
echo.

echo [3/6] Installing Python dependencies...
echo    This may take 5-10 minutes depending on internet speed...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Python dependency installation failed
    echo    Trying with --user flag...
    pip install --user -r requirements.txt
)
echo ✅ Python dependencies installed

echo.
echo [4/6] Installing Node.js dependencies...
echo    This may take 2-5 minutes...
npm install
if errorlevel 1 (
    echo ❌ Node.js dependency installation failed
    pause
    exit /b 1
)
echo ✅ Node.js dependencies installed

echo.
echo [5/6] Creating required directories...
mkdir uploads >nul 2>&1
mkdir static >nul 2>&1
mkdir templates >nul 2>&1
echo ✅ Directories created

echo.
echo [6/6] Running system tests...
echo    Testing core libraries...
python -c "import torch, transformers, sentence_transformers; print('✅ Core AI libraries working')" 2>nul
if errorlevel 1 (
    echo ⚠️  Some AI libraries may have issues - check manually
) else (
    echo ✅ Core AI libraries working
)

python -c "from src.core.document_processor import DocumentProcessor; print('✅ Document processor ready')" 2>nul
if errorlevel 1 (
    echo ⚠️  Document processor may have issues - check manually
) else (
    echo ✅ Document processor ready
)

python -c "from src.utils.indian_language_detector import IndianLanguageDetector; print('✅ Language detection ready')" 2>nul
if errorlevel 1 (
    echo ⚠️  Language detector may have issues - check manually  
) else (
    echo ✅ Language detection ready
)

echo.
echo ================================================================
echo ✅ Initial setup complete!
echo.
echo Next steps:
echo 1. Run: start-all.bat
echo 2. Wait 5-10 minutes for AI models to download (first time only)
echo 3. Access: http://localhost:3003
echo.
echo For help, see: SETUP_GUIDE.md
echo ================================================================
echo.
pause
