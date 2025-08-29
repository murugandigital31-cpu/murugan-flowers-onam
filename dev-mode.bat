@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer (Dev Mode)
echo.

echo Running cleanup script to free any blocked ports...
tasklist /fi "imagename eq node.exe" | find "node.exe" > nul
if %errorlevel% equ 0 (
  echo Checking port 3000...
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Killing process with PID %%a on port 3000
    taskkill /F /PID %%a
  )
  
  echo Checking port 5000...
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process with PID %%a on port 5000
    taskkill /F /PID %%a
  )
)

echo.
echo Starting backend server in dev mode...
start "Backend Server" cmd /k "cd /d %~dp0backend && \"C:\Program Files\nodejs\npm.cmd\" run dev"
timeout /t 5

echo.
echo Starting frontend server in dev mode...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && \"C:\Program Files\nodejs\npm.cmd\" run dev"

echo.
echo All servers started in development mode!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo You can now begin development. Press any key to close this window.
echo (Closing this window will NOT close the server windows)
pause >nul