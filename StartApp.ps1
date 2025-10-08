# Start-MuslimApp.ps1
# PowerShell script to start both backend and frontend servers

Write-Host "🕌 Starting Muslim Lifestyle Application..." -ForegroundColor Green

# Start the backend server
Write-Host "📡 Starting Flask backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command cd '$PSScriptRoot\backend'; python app.py"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start the frontend server
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
