@echo off
echo Starting Murugan Flowers - Onam Pookkolam Designer Backend Server
echo.

cd /d D:\Web_App\Onam\backend
echo Current directory: %CD%

echo Starting backend server with Node.js...
"C:\Program Files\nodejs\node.exe" -e "try { require('nodemon'); console.log('nodemon found, starting server...'); process.exit(0); } catch(e) { console.log('Installing nodemon...'); require('child_process').execSync('\"C:\\Program Files\\nodejs\\npm.cmd\" install nodemon --no-save', {stdio: 'inherit'}); }"

"C:\Program Files\nodejs\node.exe" --experimental-modules --es-module-specifier-resolution=node src/server.js

echo.
echo If the server started successfully, it should be accessible at http://localhost:5000
echo Press Ctrl+C to stop the server.
pause