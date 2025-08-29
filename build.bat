@echo off
echo ===== Onam Pookkolam Designer Production Build =====

echo.
echo Building Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Frontend build failed!
  exit /b %ERRORLEVEL%
)
echo Frontend build successful!

echo.
echo Preparing Backend...
cd ..\backend
call npm install --production
if %ERRORLEVEL% NEQ 0 (
  echo Backend preparation failed!
  exit /b %ERRORLEVEL%
)
echo Backend preparation successful!

echo.
echo ===== Build Complete =====
echo.
echo To start the production server:
echo 1. Set NODE_ENV=production
echo 2. Run 'npm start' in the backend directory
echo.
echo The application will be available at http://localhost:5000
echo.