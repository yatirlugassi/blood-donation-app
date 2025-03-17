# PowerShell script to start the React application
Write-Host "Starting the React application..." -ForegroundColor Green

# Navigate to the frontend directory
Set-Location -Path .\frontend

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path -Path .\node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the application
Write-Host "Starting the development server..." -ForegroundColor Cyan
npm start 