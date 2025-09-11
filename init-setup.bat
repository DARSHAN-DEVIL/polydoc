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
    set /p continue="Press Enter to continue or Ctrl+C to exit..."
)

echo.
echo [1/6] Checking system requirements...

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.9+ from https://python.org
    echo    ✅ IMPORTANT: Check "Add Python to PATH" during installation
    echo.
    echo Press any key to exit and install Python, then re-run this script...
    pause >nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo    %%i
    echo ✅ Python found
)

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+ from https://nodejs.org
    echo.
    echo Press any key to exit and install Node.js, then re-run this script...
    pause >nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version 2^>^&1') do echo    %%i
    echo ✅ Node.js found
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found! Please reinstall Node.js
    echo.
    echo Press any key to exit and reinstall Node.js...
    pause >nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version 2^>^&1') do echo    %%i
    echo ✅ npm found
)

REM Check Git configuration
echo.
echo Checking Git configuration...
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git user name not set
    echo    Please run: git config --global user.name "Your Name"
    echo    Please run: git config --global user.email "your.email@example.com"
) else (
    echo ✅ Git configured
)

echo.
echo [2/6] Checking disk space...
python optimize_cache.py
echo.

echo [3/6] Installing Python dependencies...
echo    This may take 5-10 minutes depending on internet speed...
echo    Please be patient - downloading AI libraries...
echo.
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ⚠️  Standard pip install failed. Trying with --user flag...
    pip install --user -r requirements.txt
    if errorlevel 1 (
        echo.
        echo ❌ Python dependency installation failed completely
        echo    Please check your internet connection and try again
        echo    Or install manually: pip install -r requirements.txt
        echo.
        echo Press any key to continue anyway (some features may not work)...
        pause >nul
    ) else (
        echo ✅ Python dependencies installed (user mode)
    )
) else (
    echo ✅ Python dependencies installed successfully
)

echo.
echo [4/6] Installing Node.js dependencies...
echo    This may take 2-5 minutes...
echo    Downloading frontend packages...
echo.
npm install
if errorlevel 1 (
    echo.
    echo ❌ Node.js dependency installation failed
    echo    This might be due to network issues or npm cache problems
    echo    Try running manually: npm install --legacy-peer-deps
    echo.
    echo Press any key to continue anyway (frontend may not work)...
    pause >nul
) else (
    echo ✅ Node.js dependencies installed successfully
)

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
echo 🎉 PolyDoc AI is ready for first run!
echo.
echo Next steps:
echo 1. Run: start-all.bat
echo 2. Wait 5-10 minutes for AI models to download (first time only)
echo 3. Access: http://localhost:3003
echo 4. Upload a Hindi/Kannada document to test!
echo.
echo 📚 For detailed help, see: SETUP_GUIDE.md
echo 🎆 For troubleshooting, see: GETTING_STARTED.md
echo ================================================================
echo.
echo Press any key to finish setup...
pause >nul
echo.
echo Setup completed! You can now close this window and run start-all.bat
