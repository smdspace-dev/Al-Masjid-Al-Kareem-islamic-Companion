# Database Configuration Test
# This script tests the database connection and shows the actual database path

Write-Host "🗄️  Database Configuration Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Navigate to backend directory
$backendPath = "c:\Users\thous\OneDrive\Desktop\Workspace\Deployed\deplyment apps\09 Muslim Campanion\backend"
Set-Location $backendPath

Write-Host "📍 Current directory: $((Get-Location).Path)" -ForegroundColor Yellow

# Check if instance directory exists
$instancePath = Join-Path $backendPath "instance"
Write-Host "📁 Instance directory: $instancePath" -ForegroundColor Yellow

if (Test-Path $instancePath) {
    Write-Host "✅ Instance directory exists" -ForegroundColor Green
    
    # Check for database file
    $dbPath = Join-Path $instancePath "muslim_lifestyle.db"
    if (Test-Path $dbPath) {
        Write-Host "✅ Database file exists: $dbPath" -ForegroundColor Green
        
        # Get database file size
        $dbSize = (Get-Item $dbPath).Length
        Write-Host "📊 Database size: $([math]::Round($dbSize/1KB, 2)) KB" -ForegroundColor Gray
    } else {
        Write-Host "❌ Database file not found: $dbPath" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Instance directory not found" -ForegroundColor Red
    Write-Host "   Creating instance directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $instancePath -Force
    Write-Host "✅ Instance directory created" -ForegroundColor Green
}

# Test Python database configuration
Write-Host "`n🐍 Testing Python database configuration..." -ForegroundColor Yellow

$pythonTest = @"
import os
import sys
sys.path.append('.')

from config import Config

print("Database Configuration Test")
print("=" * 40)

# Show current directory
print(f"Current directory: {os.getcwd()}")

# Show database URI
config = Config()
print(f"Database URI: {config.SQLALCHEMY_DATABASE_URI}")

# Check if it's SQLite and show actual path
if config.SQLALCHEMY_DATABASE_URI.startswith('sqlite:///'):
    db_path = config.SQLALCHEMY_DATABASE_URI.replace('sqlite:///', '')
    print(f"SQLite file path: {db_path}")
    print(f"File exists: {os.path.exists(db_path)}")
    
    if os.path.exists(db_path):
        import os
        size = os.path.getsize(db_path)
        print(f"File size: {size} bytes ({size/1024:.2f} KB)")

print("✅ Configuration test completed")
"@

$pythonTest | Out-File -FilePath "test_db_config.py" -Encoding UTF8

try {
    & "C:/Users/thous/OneDrive/Desktop/Workspace/Deployed/deplyment apps/09 Muslim Campanion/.venv/Scripts/python.exe" test_db_config.py
} catch {
    Write-Host "❌ Python test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure virtual environment is activated" -ForegroundColor Yellow
}

# Clean up test file
Remove-Item "test_db_config.py" -ErrorAction SilentlyContinue

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "- Local development uses: backend/instance/muslim_lifestyle.db" -ForegroundColor White
Write-Host "- Production (Render) uses: sqlite:///muslim_lifestyle.db (in app root)" -ForegroundColor White
Write-Host "- The app will create the database automatically on first run" -ForegroundColor White

Write-Host "`n🚀 Ready to run!" -ForegroundColor Green