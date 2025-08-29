@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer Frontend Server
echo.

cd /d "D:\Web_App\Onam\frontend"
echo Current directory: %CD%

echo Starting frontend server with Vite...
"C:\Program Files\nodejs\node.exe" "D:\Web_App\Onam\frontend\node_modules\vite\bin\vite.js" --port 3000

pause