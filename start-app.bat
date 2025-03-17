@echo off
echo Starting Blood Donation Awareness Web Application...
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Starting the development server on port 3001...
set PORT=3001 && call npm start

echo.
echo If the browser doesn't open automatically, please visit:
echo http://localhost:3001 