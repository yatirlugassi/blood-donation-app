#!/bin/bash

echo "Starting Blood Donation Awareness Web Application..."
echo

cd frontend

echo "Installing dependencies..."
npm install

echo
echo "Starting the development server..."
npm start

echo
echo "If the browser doesn't open automatically, please visit:"
echo "http://localhost:3000" 