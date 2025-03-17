@echo off
echo Resetting Blood Donation Awareness Web Application...
echo.

cd frontend

echo Clearing node_modules...
rmdir /s /q node_modules

echo Clearing package-lock.json...
if exist package-lock.json del package-lock.json

echo Installing dependencies...
call npm install

echo.
echo Reset complete. You can now run start-app.bat to start the application.
echo. 