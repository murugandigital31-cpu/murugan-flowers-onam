@echo off
echo Cleaning up ports 3000 and 5000...

echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Killing process with PID %%a on port 3000
    taskkill /F /PID %%a >nul 2>&1
)

echo Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
    echo Killing process with PID %%a on port 5000
    taskkill /F /PID %%a >nul 2>&1
)

echo Cleanup complete
timeout /t 2 >nul