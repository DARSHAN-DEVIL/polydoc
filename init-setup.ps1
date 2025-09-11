# PolyDoc AI - PowerShell Setup Script
# This avoids batch file execution issues on new laptops

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  PolyDoc AI - New Laptop Setup (PowerShell Version)" -ForegroundColor Yellow
Write-Host "  Run this ONCE after cloning from GitHub" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Check if this is a fresh clone
if (-not (Test-Path "node_modules")) {
    Write-Host "✅ Fresh repository detected" -ForegroundColor Green
} else {
    Write-Host "⚠️ Dependencies already installed. Continue anyway?" -ForegroundColor Yellow
    Read-Host "Press Enter to continue or Ctrl+C to exit"
}

Write-Host ""
Write-Host "[1/6] Checking system requirements..." -ForegroundColor Cyan

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor White
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    $pythonVersion" -ForegroundColor Gray
        Write-Host "✅ Python found" -ForegroundColor Green
    } else {
        throw "Python not found"
    }
} catch {
    Write-Host "❌ Python not found! Please install Python 3.9+ from https://python.org" -ForegroundColor Red
    Write-Host "   ✅ IMPORTANT: Check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit and install Python, then re-run this script..." -ForegroundColor Yellow
    Read-Host
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor White
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    $nodeVersion" -ForegroundColor Gray
        Write-Host "✅ Node.js found" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    Write-Host ""
    Write-Host "Press any key to exit and install Node.js, then re-run this script..." -ForegroundColor Yellow
    Read-Host
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor White
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    v$npmVersion" -ForegroundColor Gray
        Write-Host "✅ npm found" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "❌ npm not found! Please reinstall Node.js" -ForegroundColor Red
    Write-Host ""
    Write-Host "Press any key to exit and reinstall Node.js..." -ForegroundColor Yellow
    Read-Host
    exit 1
}

# Check Git configuration
Write-Host ""
Write-Host "Checking Git configuration..." -ForegroundColor White
try {
    $gitUser = git config --global user.name 2>&1
    if ($LASTEXITCODE -eq 0 -and $gitUser.Trim() -ne "") {
        Write-Host "✅ Git configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Git user name not set" -ForegroundColor Yellow
        Write-Host "   Please run: git config --global user.name 'Your Name'" -ForegroundColor Gray
        Write-Host "   Please run: git config --global user.email 'your.email@example.com'" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️ Git configuration check failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/6] Checking disk space..." -ForegroundColor Cyan
python optimize_cache.py

Write-Host ""
Write-Host "[3/6] Installing Python dependencies..." -ForegroundColor Cyan
Write-Host "   This may take 5-10 minutes depending on internet speed..." -ForegroundColor Gray
Write-Host "   Please be patient - downloading AI libraries..." -ForegroundColor Gray
Write-Host ""

try {
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "⚠️ Standard pip install failed. Trying with --user flag..." -ForegroundColor Yellow
        pip install --user -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "❌ Python dependency installation failed completely" -ForegroundColor Red
            Write-Host "   Please check your internet connection and try again" -ForegroundColor Yellow
            Write-Host "   Or install manually: pip install -r requirements.txt" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Press any key to continue anyway (some features may not work)..." -ForegroundColor Yellow
            Read-Host
        } else {
            Write-Host "✅ Python dependencies installed (user mode)" -ForegroundColor Green
        }
    } else {
        Write-Host "✅ Python dependencies installed successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error during Python package installation: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "[4/6] Installing Node.js dependencies..." -ForegroundColor Cyan
Write-Host "   This may take 2-5 minutes..." -ForegroundColor Gray
Write-Host "   Downloading frontend packages..." -ForegroundColor Gray
Write-Host ""

try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Node.js dependency installation failed" -ForegroundColor Red
        Write-Host "   This might be due to network issues or npm cache problems" -ForegroundColor Yellow
        Write-Host "   Try running manually: npm install --legacy-peer-deps" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Press any key to continue anyway (frontend may not work)..." -ForegroundColor Yellow
        Read-Host
    } else {
        Write-Host "✅ Node.js dependencies installed successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error during npm installation: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "[5/6] Creating required directories..." -ForegroundColor Cyan
$directories = @("uploads", "static", "templates")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-Host "✅ Directories created" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Running system tests..." -ForegroundColor Cyan
Write-Host "   Testing core libraries..." -ForegroundColor Gray

# Test AI libraries
try {
    python -c "import torch, transformers, sentence_transformers; print('✅ Core AI libraries working')" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Core AI libraries working" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Some AI libraries may have issues - check manually" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not test AI libraries" -ForegroundColor Yellow
}

# Test document processor
try {
    python -c "from src.core.document_processor import DocumentProcessor; print('✅ Document processor ready')" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Document processor ready" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Document processor may have issues - check manually" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not test document processor" -ForegroundColor Yellow
}

# Test language detector
try {
    python -c "from src.utils.indian_language_detector import IndianLanguageDetector; print('✅ Language detection ready')" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Language detection ready" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Language detector may have issues - check manually" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not test language detector" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "✅ Initial setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 PolyDoc AI is ready for first run!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: start-all.bat" -ForegroundColor White
Write-Host "2. Wait 5-10 minutes for AI models to download (first time only)" -ForegroundColor White
Write-Host "3. Access: http://localhost:3003" -ForegroundColor White
Write-Host "4. Upload a Hindi/Kannada document to test!" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed help, see: SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host "🎆 For troubleshooting, see: GETTING_STARTED.md" -ForegroundColor Gray
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to finish setup..." -ForegroundColor Yellow
Read-Host
Write-Host ""
Write-Host "Setup completed! You can now close this window and run start-all.bat" -ForegroundColor Green
