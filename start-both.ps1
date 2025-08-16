# PolyDoc AI - Start Both Services
Write-Host "Starting PolyDoc AI Application..." -ForegroundColor Green

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Z:\polydoc-ai'; Write-Host 'Starting Backend Server...' -ForegroundColor Blue; python main.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Z:\polydoc-ai'; Write-Host 'Starting Frontend Server...' -ForegroundColor Cyan; node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev"

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host
