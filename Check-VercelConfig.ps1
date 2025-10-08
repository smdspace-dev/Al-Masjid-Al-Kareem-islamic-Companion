# 🔍 Vercel Deployment Verification Script
# This script checks if your project is properly configured for Vercel

Write-Host "🕌 Muslim Companion App - Vercel Configuration Check" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$allGood = $true

# Check vercel.json
Write-Host "`n📋 Checking vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
    try {
        $vercelConfig = Get-Content "vercel.json" | ConvertFrom-Json
        if ($vercelConfig.version -eq 2) {
            Write-Host "✅ Version 2 configuration detected" -ForegroundColor Green
        }
        if ($vercelConfig.builds) {
            Write-Host "✅ Builds configuration found" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ vercel.json has invalid JSON syntax" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "❌ vercel.json missing" -ForegroundColor Red
    $allGood = $false
}

# Check api directory
Write-Host "`n🐍 Checking Python API setup..." -ForegroundColor Yellow
if (Test-Path "api/index.py") {
    Write-Host "✅ api/index.py exists" -ForegroundColor Green
} else {
    Write-Host "❌ api/index.py missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "api/requirements.txt") {
    Write-Host "✅ api/requirements.txt exists" -ForegroundColor Green
} else {
    Write-Host "❌ api/requirements.txt missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "api/app.py") {
    Write-Host "✅ api/app.py exists" -ForegroundColor Green
} else {
    Write-Host "❌ api/app.py missing" -ForegroundColor Red
    $allGood = $false
}

# Check frontend
Write-Host "`n⚛️  Checking React frontend setup..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Write-Host "✅ frontend/package.json exists" -ForegroundColor Green
} else {
    Write-Host "❌ frontend/package.json missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "frontend/vite.config.js") {
    Write-Host "✅ Vite configuration found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vite config missing (might be okay)" -ForegroundColor Yellow
}

# Check Git repository
Write-Host "`n📦 Checking Git repository..." -ForegroundColor Yellow
try {
    $gitRemote = git remote get-url origin 2>$null
    if ($gitRemote) {
        Write-Host "✅ Git remote configured: $gitRemote" -ForegroundColor Green
    } else {
        Write-Host "❌ No Git remote configured" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "❌ Not a Git repository" -ForegroundColor Red
    $allGood = $false
}

# Check for large files
Write-Host "`n📏 Checking for large files..." -ForegroundColor Yellow
$largeFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 10MB }
if ($largeFiles.Count -gt 0) {
    Write-Host "⚠️  Found large files (might slow deployment):" -ForegroundColor Yellow
    foreach ($file in $largeFiles) {
        $sizeMB = [math]::Round($file.Length/1MB, 2)
        Write-Host "   $($file.FullName) ($sizeMB MB)" -ForegroundColor Gray 
    }
} else {
    Write-Host "✅ No large files detected" -ForegroundColor Green
}

# Final verdict
Write-Host "`n🎯 Configuration Summary:" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ Your project is ready for Vercel deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com and sign in with GitHub"
    Write-Host "2. Click 'New Project' and import your repository"
    Write-Host "3. Vercel should auto-detect the configuration"
    Write-Host "4. Click 'Deploy' and wait for completion"
    Write-Host ""
    Write-Host "📱 Your app will be live at: https://your-project-name.vercel.app" -ForegroundColor Green
} else {
    Write-Host "❌ Some issues found. Please fix them before deploying." -ForegroundColor Red
}

Write-Host "`n🕌 Barakallahu feek! (May Allah bless you!)" -ForegroundColor Magenta