#!/bin/bash

echo "Resetting Blood Donation Awareness Web Application..."
echo

cd frontend

echo "Clearing node_modules..."
rm -rf node_modules

echo "Clearing package-lock.json..."
if [ -f package-lock.json ]; then
  rm package-lock.json
fi

echo "Installing dependencies..."
npm install

echo
echo "Reset complete. You can now run ./start-app.sh to start the application."
echo 