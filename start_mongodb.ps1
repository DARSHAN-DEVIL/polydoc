# PolyDoc MongoDB Startup Script
Write-Host "Starting MongoDB for PolyDoc..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB data directory exists
$dataDir = "C:\data\db"
if (-not (Test-Path $dataDir)) {
    Write-Host "Creating MongoDB data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
    Write-Host "Data directory created at $dataDir" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Starting MongoDB server..." -ForegroundColor Yellow
Write-Host "MongoDB will use data directory: $dataDir" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop MongoDB, press Ctrl+C in this window." -ForegroundColor Yellow
Write-Host ""

# Try to find MongoDB executable
$mongodPaths = @(
    "mongod",  # If in PATH
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe", 
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
)

$mongodPath = $null
foreach ($path in $mongodPaths) {
    if ($path -eq "mongod") {
        # Check if mongod is in PATH
        try {
            $null = Get-Command mongod -ErrorAction Stop
            $mongodPath = "mongod"
            Write-Host "Found mongod in PATH" -ForegroundColor Green
            break
        } catch {
            continue
        }
    } elseif (Test-Path $path) {
        $mongodPath = $path
        $version = $path | Select-String -Pattern "\\(\d+\.\d+)\\" | ForEach-Object { $_.Matches[0].Groups[1].Value }
        Write-Host "Found MongoDB $version at: $path" -ForegroundColor Green
        break
    }
}

if (-not $mongodPath) {
    Write-Host "ERROR: MongoDB not found!" -ForegroundColor Red
    Write-Host "Please install MongoDB Community Server from:" -ForegroundColor Yellow
    Write-Host "https://www.mongodb.com/try/download/community" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Or add MongoDB to your PATH environment variable." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start MongoDB
try {
    Write-Host "Starting MongoDB..." -ForegroundColor Green
    if ($mongodPath -eq "mongod") {
        & mongod --dbpath $dataDir
    } else {
        & $mongodPath --dbpath $dataDir
    }
} catch {
    Write-Host "Error starting MongoDB: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
