<#
  start-server.ps1

  Helper script to install dependencies and start the Express server for Task 2.
  Usage: .\start-server.ps1
#>

Write-Host "Checking Node.js / npm availability..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js not found. Please install Node.js from https://nodejs.org/ and reopen PowerShell."
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm not found. Please ensure npm is installed with Node.js."
  exit 1
}

Write-Host "Installing npm dependencies (express)..."
npm install

if ($LASTEXITCODE -ne 0) {
  Write-Error "npm install failed. Check output above."
  exit $LASTEXITCODE
}

Write-Host "Starting server (npm start). The server will listen on http://localhost:8000"
npm start
