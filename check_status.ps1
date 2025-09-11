# PolyDoc System Status Checker
Write-Host "PolyDoc System Status Check" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "1. Checking MongoDB..." -ForegroundColor Yellow
$mongoPort = netstat -an | Select-String "27017"
if ($mongoPort) {
    Write-Host "   ✅ MongoDB is running on port 27017" -ForegroundColor Green
} else {
    Write-Host "   ❌ MongoDB is not running" -ForegroundColor Red
    Write-Host "   📝 Solution: Run 'start_mongodb.bat' or 'mongod --dbpath C:\data\db'" -ForegroundColor Gray
}

Write-Host ""

# Check Backend
Write-Host "2. Checking Backend..." -ForegroundColor Yellow
$backendPort = netstat -an | Select-String "8000"
if ($backendPort) {
    Write-Host "   ✅ Backend is running on port 8000" -ForegroundColor Green
    
    # Test health endpoint
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
        if ($response.status -eq "healthy") {
            Write-Host "   ✅ Backend health check passed" -ForegroundColor Green
            if ($response.models_loaded) {
                Write-Host "   ✅ AI models are loaded" -ForegroundColor Green
            } else {
                Write-Host "   ⏳ AI models are still loading..." -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "   ⚠️  Backend is running but health check failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Backend is not running" -ForegroundColor Red
    Write-Host "   📝 Solution: Run 'python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload'" -ForegroundColor Gray
}

Write-Host ""

# Check Frontend
Write-Host "3. Checking Frontend..." -ForegroundColor Yellow
$frontendPort = netstat -an | Select-String "3000"
if ($frontendPort) {
    Write-Host "   ✅ Frontend is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend is not running" -ForegroundColor Red
    Write-Host "   📝 Solution: Run 'npm start'" -ForegroundColor Gray
}

Write-Host ""

# Check MongoDB data directory
Write-Host "4. Checking MongoDB data directory..." -ForegroundColor Yellow
if (Test-Path "C:\data\db") {
    Write-Host "   ✅ MongoDB data directory exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ MongoDB data directory missing" -ForegroundColor Red
    Write-Host "   📝 Solution: Create directory with 'mkdir C:\data\db'" -ForegroundColor Gray
}

Write-Host ""

# Test MongoDB connection
Write-Host "5. Testing MongoDB connection..." -ForegroundColor Yellow
try {
    $pythonTest = python -c "import pymongo; pymongo.MongoClient('mongodb://localhost:27017').admin.command('ping'); print('✅ MongoDB connection successful')" 2>$null
    if ($pythonTest -like "*successful*") {
        Write-Host "   ✅ MongoDB connection test passed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MongoDB connection test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Could not test MongoDB connection" -ForegroundColor Red
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "--------" -ForegroundColor Cyan

# Count issues
$issues = 0
if (-not $mongoPort) { $issues++ }
if (-not $backendPort) { $issues++ }
if (-not $frontendPort) { $issues++ }

if ($issues -eq 0) {
    Write-Host "🎉 All services are running! Your PolyDoc system should be working." -ForegroundColor Green
    Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor Gray
    Write-Host "   🔧 Backend: http://localhost:8000" -ForegroundColor Gray
    Write-Host "   💾 MongoDB: mongodb://localhost:27017" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Found $issues issue(s). Please check the solutions above." -ForegroundColor Yellow
    Write-Host "   📖 See STARTUP_GUIDE.md for detailed instructions" -ForegroundColor Gray
}

Write-Host ""
