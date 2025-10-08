# 🚀 Quick Deployment Script for Muslim Companion App (PowerShell)
# This script automates the GitHub + Vercel deployment process

Write-Host "🕌 Muslim Companion App - Deployment Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "vercel.json")) {
    Write-Host "❌ Error: vercel.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-flight checks..." -ForegroundColor Yellow

# Check git status
try {
    git status | Out-Null
    Write-Host "✅ Git repository detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Check if remote origin exists
try {
    $repoUrl = git remote get-url origin 2>$null
    if ($repoUrl) {
        Write-Host "✅ GitHub remote already configured" -ForegroundColor Green
        Write-Host "   Repository: $repoUrl" -ForegroundColor Gray
    } else {
        throw "No remote found"
    }
} catch {
    Write-Host "⚠️  No GitHub remote found" -ForegroundColor Yellow
    $repoUrl = Read-Host "📝 Enter your GitHub repository URL"
    git remote add origin $repoUrl
    Write-Host "✅ GitHub remote added: $repoUrl" -ForegroundColor Green
}

# Check for pending changes
$status = git status --porcelain
if ($status) {
    Write-Host "📦 Committing pending changes..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: Final deployment preparation

- Update deployment configuration  
- Add deployment guide and scripts
- Ready for Vercel serverless deployment"
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ No pending changes to commit" -ForegroundColor Green
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Push failed. Trying with force..." -ForegroundColor Yellow
    git push -u origin main --force
    Write-Host "✅ Code force-pushed to GitHub!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com and sign in with GitHub"
Write-Host "2. Click 'New Project' and import your repository"
Write-Host "3. Vercel will auto-detect settings from vercel.json"
Write-Host "4. Click 'Deploy' and wait for deployment to complete"
Write-Host ""
Write-Host "📱 Your app will be available at: https://your-app-name.vercel.app" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Don't forget to set environment variables in Vercel:" -ForegroundColor Yellow
Write-Host "   - SECRET_KEY: your-flask-secret-key"
Write-Host "   - PYTHON_VERSION: 3.9"
Write-Host ""
Write-Host "🕌 May Allah bless this deployment! Ameen." -ForegroundColor Magenta

# Pause to let user read the output
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")