@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer Frontend Server
echo.

cd /d D:\Web_App\Onam\frontend
echo Current directory: %CD%

echo Installing missing dependencies if needed...
"C:\Program Files\nodejs\npm.cmd" install --no-save
"C:\Program Files\nodejs\npm.cmd" install react-router-dom --save

echo Starting frontend development server...
"C:\Program Files\nodejs\npx.cmd" vite --port 3000

echo.
echo If the server started successfully, it should be accessible at http://localhost:3000
echo Press Ctrl+C to stop the server.
pause