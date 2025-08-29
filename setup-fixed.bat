@echo off
echo Setting up Murugan Flowers - Onam Pookkolam Designer Development Environment
echo.

echo Installing backend dependencies...
cd backend
"C:\Program Files\nodejs\npm.cmd" install
echo.

echo Installing frontend dependencies...
cd ../frontend
"C:\Program Files\nodejs\npm.cmd" install
echo.

echo Setup complete!
echo.
echo To start the development servers:
echo 1. Open a new terminal and run: cd backend ^&^& "C:\Program Files\nodejs\npm.cmd" run dev
echo 2. Open another terminal and run: cd frontend ^&^& "C:\Program Files\nodejs\npm.cmd" run dev
echo.
echo The application will be available at http://localhost:3000
echo The API server will be running at http://localhost:5000
echo.
pause