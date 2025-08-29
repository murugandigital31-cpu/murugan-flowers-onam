@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer Development Servers
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo You can now begin development. Press any key to close this window.
pause >nul