@echo off
echo ===== Starting Onam Pookkolam Designer Production Server =====

echo.
echo Setting production environment...
set NODE_ENV=production

echo.
echo Starting production server...
cd backend
node src/server.js

echo.
if %ERRORLEVEL% NEQ 0 (
  echo Server failed to start!
  exit /b %ERRORLEVEL%
)