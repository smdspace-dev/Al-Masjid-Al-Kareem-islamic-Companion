# Start-MuslimApp.ps1
# PowerShell script to start both backend and frontend servers

Write-Host "🕌 Starting Muslim Lifestyle Application..." -ForegroundColor Green

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connections.Count -gt 0
}

# Kill any processes using port 3000 (frontend) or 5000 (backend)
if (Test-PortInUse 3000) {
    Write-Host "Port 3000 is already in use. Attempting to free it..." -ForegroundColor Yellow
    $process = Get-Process | Where-Object {$_.Id -in (Get-NetTCPConnection -LocalPort 3000).OwningProcess}
    if ($process) {
        Stop-Process -Id $process.Id -Force
        Write-Host "Stopped process using port 3000: $($process.ProcessName)" -ForegroundColor Cyan
    }
}

if (Test-PortInUse 5000) {
    Write-Host "Port 5000 is already in use. Attempting to free it..." -ForegroundColor Yellow
    $process = Get-Process | Where-Object {$_.Id -in (Get-NetTCPConnection -LocalPort 5000).OwningProcess}
    if ($process) {
        Stop-Process -Id $process.Id -Force
        Write-Host "Stopped process using port 5000: $($process.ProcessName)" -ForegroundColor Cyan
    }
}

# Start the backend server in a new window
Write-Host "📡 Starting Flask backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command cd '$PSScriptRoot\backend'; python app.py"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start the frontend server in a new window
Write-Host "🌐 Starting React frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command cd '$PSScriptRoot\frontend'; npm run dev"

# Open browser tabs
Start-Sleep -Seconds 5
Write-Host "🔗 Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"
Start-Process "http://localhost:3000/test.html"

Write-Host "✅ All services started successfully!" -ForegroundColor Green
Write-Host "📊 Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "🖥️ Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "🛠️ Test Page: http://localhost:3000/test.html" -ForegroundColor Green
