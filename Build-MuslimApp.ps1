# Build-MuslimApp.ps1
# PowerShell script to build the application for production

Write-Host "🕌 Building Muslim Lifestyle Application for production..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location "$PSScriptRoot\frontend"

# Install dependencies if needed
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Build frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

# Check if build succeeded
if (!(Test-Path "$PSScriptRoot\frontend\dist")) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Copy frontend build to backend static folder
Write-Host "📂 Copying frontend build to backend..." -ForegroundColor Cyan

# Create static folder if it doesn't exist
if (!(Test-Path "$PSScriptRoot\backend\static")) {
    New-Item -Path "$PSScriptRoot\backend\static" -ItemType Directory
}

# Remove old frontend files if they exist
if (Test-Path "$PSScriptRoot\backend\static\frontend") {
    Remove-Item -Path "$PSScriptRoot\backend\static\frontend" -Recurse -Force
}

# Copy new frontend files
Copy-Item -Path "$PSScriptRoot\frontend\dist" -Destination "$PSScriptRoot\backend\static\frontend" -Recurse

# Navigate to backend directory
Set-Location "$PSScriptRoot\backend"

# Install backend dependencies if needed
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Create production configuration
Write-Host "⚙️ Creating production configuration..." -ForegroundColor Cyan

# Success message
Write-Host "`n✅ Production build completed successfully!" -ForegroundColor Green
Write-Host "📊 To run in production mode:" -ForegroundColor Green
Write-Host "   1. Navigate to the backend directory: cd $PSScriptRoot\backend" -ForegroundColor White
Write-Host "   2. Set Flask environment: $env:FLASK_ENV = 'production'" -ForegroundColor White
Write-Host "   3. Run the application: python app.py" -ForegroundColor White
Write-Host "`n🌐 The application will be available at http://127.0.0.1:5000" -ForegroundColor Green
