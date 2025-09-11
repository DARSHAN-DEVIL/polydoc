@echo off
echo ====================================
echo PolyDoc ML Training Framework Runner
echo ====================================

cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7+ and add it to your PATH
    pause
    exit /b 1
)

REM Check if required packages are installed
python -c "import pandas, numpy, sklearn, asyncio" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install pandas numpy scikit-learn
    if errorlevel 1 (
        echo Error: Failed to install required packages
        pause
        exit /b 1
    )
)

REM Show menu
:menu
echo.
echo Choose test type:
echo 1. Basic Test (all components)
echo 2. Classification Only
echo 3. Question-Answering Only
echo 4. Robustness Test Only
echo 5. Custom CSV Test
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo Running Basic Test...
    python run_tests.py --test-type basic
) else if "%choice%"=="2" (
    echo Running Classification Test...
    python run_tests.py --test-type classification
) else if "%choice%"=="3" (
    echo Running QA Test...
    python run_tests.py --test-type qa
) else if "%choice%"=="4" (
    echo Running Robustness Test...
    python run_tests.py --test-type robustness
) else if "%choice%"=="5" (
    echo Running Custom CSV Test...
    set /p csv_path="Enter path to your CSV file: "
    python run_tests.py --test-type custom --csv-path "%csv_path%"
) else if "%choice%"=="6" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    goto menu
)

echo.
echo Test completed. Check the output above for results.
set /p continue="Press Enter to return to menu or Ctrl+C to exit..."
goto menu
