# Muslim Companion - Render Deployment Verification
# Run this script to verify your deployment is working

Write-Host "🕌 Muslim Companion - Render Deployment Verification" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Get backend URL from user
$backendUrl = Read-Host "Enter your Render backend URL (e.g., https://muslim-companion-backend.onrender.com)"
$frontendUrl = Read-Host "Enter your Render frontend URL (e.g., https://muslim-companion-frontend.onrender.com)"

Write-Host "`n🔍 Testing Backend..." -ForegroundColor Yellow

try {
    $backendResponse = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 30
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
        $data = $backendResponse.Content | ConvertFrom-Json
        Write-Host "   Message: $($data.message)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   Note: First request after deployment may take 30+ seconds" -ForegroundColor Yellow
}

Write-Host "`n🔍 Testing Backend API Endpoints..." -ForegroundColor Yellow

# Test Quran API
try {
    $quranUrl = "$backendUrl/api/quran/surahs"
    $quranResponse = Invoke-WebRequest -Uri $quranUrl -Method GET -TimeoutSec 30
    if ($quranResponse.StatusCode -eq 200) {
        Write-Host "✅ Quran API working!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Quran API failed" -ForegroundColor Red
}

# Test Auth API
try {
    $authUrl = "$backendUrl/api/auth/login"
    $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $authResponse = Invoke-WebRequest -Uri $authUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 30
    if ($authResponse.StatusCode -eq 200) {
        Write-Host "✅ Authentication API working!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Authentication API failed" -ForegroundColor Red
}

Write-Host "`n🌐 Testing Frontend..." -ForegroundColor Yellow

try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 30
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is live!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor White
Write-Host "Backend URL:  $backendUrl" -ForegroundColor White
Write-Host "Admin Login:  admin / admin123" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Test your app:" -ForegroundColor Green
Write-Host "1. Open: $frontendUrl" -ForegroundColor Gray
Write-Host "2. Login with admin credentials" -ForegroundColor Gray
Write-Host "3. Test Quran, Prayer Times, and other features" -ForegroundColor Gray

Write-Host "`n⚠️  Note: Free tier services sleep after 15 min of inactivity" -ForegroundColor Yellow
Write-Host "   First request after sleep may take 30+ seconds to respond" -ForegroundColor Yellow