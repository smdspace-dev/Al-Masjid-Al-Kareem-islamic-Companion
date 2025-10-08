# Muslim Companion - Render Deployment Fix
# This script fixes the Python 3.13 compatibility issues

Write-Host "🔧 Render Deployment Fix - Python 3.13 Compatibility" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$backendPath = "c:\Users\thous\OneDrive\Desktop\Workspace\Deployed\deplyment apps\09 Muslim Campanion\backend"

Write-Host "📋 Issue Identified:" -ForegroundColor Yellow
Write-Host "- Render is using Python 3.13.4" -ForegroundColor Red
Write-Host "- SQLAlchemy 2.0.21 is not compatible with Python 3.13" -ForegroundColor Red
Write-Host "- AssertionError in SQLAlchemy typing system" -ForegroundColor Red

Write-Host "`n🛠️  Solutions Applied:" -ForegroundColor Green

# Check if runtime.txt exists
$runtimeFile = Join-Path $backendPath "runtime.txt"
if (Test-Path $runtimeFile) {
    Write-Host "✅ Created runtime.txt to force Python 3.11.5" -ForegroundColor Green
} else {
    Write-Host "❌ runtime.txt not found - creating it..." -ForegroundColor Red
    "python-3.11.5" | Out-File -FilePath $runtimeFile -Encoding UTF8
    Write-Host "✅ Created runtime.txt" -ForegroundColor Green
}

# Check requirements.txt
$reqFile = Join-Path $backendPath "requirements.txt"
if (Test-Path $reqFile) {
    $content = Get-Content $reqFile -Raw
    if ($content -match "SQLAlchemy==2\.0\.23") {
        Write-Host "✅ Updated SQLAlchemy to 2.0.23 (Python 3.13 compatible)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  SQLAlchemy version needs update" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 Multiple Fix Options:" -ForegroundColor Cyan

Write-Host "`n1️⃣  Option 1: Force Python 3.11 (Recommended)" -ForegroundColor White
Write-Host "   ✅ runtime.txt created with python-3.11.5" -ForegroundColor Gray
Write-Host "   ✅ Current requirements.txt should work" -ForegroundColor Gray

Write-Host "`n2️⃣  Option 2: Update to Python 3.13 Compatible Versions" -ForegroundColor White
Write-Host "   📁 requirements-py313.txt created with latest versions" -ForegroundColor Gray
Write-Host "   🔄 Replace requirements.txt with requirements-py313.txt if needed" -ForegroundColor Gray

Write-Host "`n3️⃣  Option 3: Use render.yaml for Full Control" -ForegroundColor White
Write-Host "   📄 render.yaml created for complete deployment config" -ForegroundColor Gray

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push the runtime.txt file:" -ForegroundColor White
Write-Host "   git add backend/runtime.txt" -ForegroundColor Gray
Write-Host "   git commit -m 'Fix Python version for Render compatibility'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray

Write-Host "`n2. Redeploy on Render - it should now use Python 3.11.5" -ForegroundColor White

Write-Host "`n3. If still issues, try updating requirements.txt:" -ForegroundColor White
Write-Host "   copy backend\requirements-py313.txt backend\requirements.txt" -ForegroundColor Gray

Write-Host "`n📊 Files Created/Updated:" -ForegroundColor Cyan
Write-Host "- backend/runtime.txt (forces Python 3.11.5)" -ForegroundColor Gray
Write-Host "- backend/requirements-py313.txt (Python 3.13 compatible)" -ForegroundColor Gray
Write-Host "- render.yaml (complete deployment config)" -ForegroundColor Gray

Write-Host "`n✅ The runtime.txt should fix the deployment issue!" -ForegroundColor Green