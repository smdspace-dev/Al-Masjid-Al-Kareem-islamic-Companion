# Database Configuration Test
# This script tests the database connection and shows the actual database path

Write-Host "Database Configuration Test" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Navigate to backend directory
$backendPath = "c:\Users\thous\OneDrive\Desktop\Workspace\Deployed\deplyment apps\09 Muslim Campanion\backend"
Set-Location $backendPath

Write-Host "Current directory: $((Get-Location).Path)" -ForegroundColor Yellow

# Check if instance directory exists
$instancePath = Join-Path $backendPath "instance"
Write-Host "Instance directory: $instancePath" -ForegroundColor Yellow

if (Test-Path $instancePath) {
    Write-Host "Instance directory exists" -ForegroundColor Green
    
    # Check for database file
    $dbPath = Join-Path $instancePath "muslim_lifestyle.db"
    if (Test-Path $dbPath) {
        Write-Host "Database file exists: $dbPath" -ForegroundColor Green
        
        # Get database file size
        $dbSize = (Get-Item $dbPath).Length
        Write-Host "Database size: $([math]::Round($dbSize/1KB, 2)) KB" -ForegroundColor Gray
    } else {
        Write-Host "Database file not found: $dbPath" -ForegroundColor Red
    }
} else {
    Write-Host "Instance directory not found" -ForegroundColor Red
    Write-Host "Creating instance directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $instancePath -Force
    Write-Host "Instance directory created" -ForegroundColor Green
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Local development uses: backend/instance/muslim_lifestyle.db" -ForegroundColor White
Write-Host "- Production (Render) uses: sqlite:///muslim_lifestyle.db (in app root)" -ForegroundColor White
Write-Host "- The app will create the database automatically on first run" -ForegroundColor White

Write-Host ""
Write-Host "Ready to run!" -ForegroundColor Green