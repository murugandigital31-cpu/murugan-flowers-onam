@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer
echo.

echo Starting backend server...
start "Backend Server" cmd /c "D:\Web_App\Onam\run-backend.bat"
timeout /t 3

echo Starting frontend server...
start "Frontend Server" cmd /c "D:\Web_App\Onam\run-frontend.bat"

echo.
echo Servers should be starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo You can now begin development. Press any key to close this window.
echo (Closing this window will NOT close the server windows)
pause