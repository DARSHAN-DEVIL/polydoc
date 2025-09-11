@echo off
cls
color 0A
title PolyDoc AI - Simple Test

echo.
echo ================================================================
echo   PolyDoc AI - Simple Setup Test
echo   If this runs completely, init-setup.bat should work too
echo ================================================================
echo.

echo Step 1: Testing basic commands...
echo Current directory: %CD%
echo.

echo Step 2: Testing Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found
) else (
    echo SUCCESS: Python found
)
echo.

echo Step 3: Testing Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found
) else (
    echo SUCCESS: Node.js found
)
echo.

echo Step 4: Testing npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found
) else (
    echo SUCCESS: npm found
)
echo.

echo Step 5: Testing file existence...
if exist requirements.txt (
    echo SUCCESS: requirements.txt found
) else (
    echo ERROR: requirements.txt not found
)

if exist package.json (
    echo SUCCESS: package.json found
) else (
    echo ERROR: package.json not found
)
echo.

echo ================================================================
echo Test completed! If you see this message, batch files work properly.
echo If init-setup.bat still exits early, the issue might be:
echo - Antivirus blocking the script
echo - PowerShell execution policy
echo - Path or permission issues
echo ================================================================
echo.
echo Press any key to exit...
pause >nul
