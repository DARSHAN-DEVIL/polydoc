# PolyDoc AI Development Server Launcher
# This script bypasses PowerShell execution policy restrictions

Write-Host "Starting PolyDoc AI Frontend Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:3003" -ForegroundColor Cyan
Write-Host "Dark mode toggle available in the top-right corner" -ForegroundColor Yellow
Write-Host ""
Write-Host "Features:" -ForegroundColor Blue
Write-Host "  - Landing page with Google Sign-In" -ForegroundColor White
Write-Host "  - Protected dashboard with document chat" -ForegroundColor White
Write-Host "  - Dark/Light mode theme toggle" -ForegroundColor White
Write-Host "  - Responsive design for mobile and desktop" -ForegroundColor White
Write-Host ""

Set-Location "Z:\polydoc-ai"

# Try to use the local Vite installation
if (Test-Path "node_modules\.bin\vite.cmd") {
    Write-Host "Using local Vite installation..." -ForegroundColor Green
    & "node_modules\.bin\vite.cmd" --port 3003
} elseif (Test-Path "node_modules\.bin\vite") {
    Write-Host "Using local Vite installation..." -ForegroundColor Green
    & "node_modules\.bin\vite" --port 3003
} else {
    Write-Host "Local Vite not found, trying global..." -ForegroundColor Yellow
    try {
        & vite --port 3003
    } catch {
        Write-Host "Error: Vite not found. Please run 'npm install' first." -ForegroundColor Red
        Read-Host "Press Enter to exit"
    }
}

Read-Host "Press Enter to exit"
