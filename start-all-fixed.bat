@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer
echo.

echo Running cleanup script to free any blocked ports...
call "%~dp0cleanup-ports.bat"

echo Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0backend && \"C:\Program Files\nodejs\node.exe\" src/server.js"
timeout /t 5

echo.
echo Ensuring all dependencies are installed for frontend...
cd /d %~dp0frontend
"C:\Program Files\nodejs\npm.cmd" install react-router-dom --save
timeout /t 5

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && \"C:\Program Files\nodejs\npx.cmd\" vite --port 3000"

echo.
echo All servers started!
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo You can now begin development. Press any key to close this window.
echo (Closing this window will NOT close the server windows)
pause >nul