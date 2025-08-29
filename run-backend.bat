@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer Backend Server
echo.

cd /d "D:\Web_App\Onam\backend"
echo Current directory: %CD%

echo Starting backend server with Node.js...
"C:\Program Files\nodejs\node.exe" src/server.js

pause