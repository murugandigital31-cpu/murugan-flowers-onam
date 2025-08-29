@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer
echo.

echo Running cleanup script to free any blocked ports...
call cleanup-ports.bat

echo Starting backend server...
start "Backend Server" cmd /k "start-backend-direct.bat"
timeout /t 5

echo Starting frontend server...
start "Frontend Server" cmd /k "start-frontend-direct.bat"

echo.
echo Servers should be starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo You can now begin development. Press any key to close this window.
echo (Closing this window will NOT close the server windows)
pause >nul