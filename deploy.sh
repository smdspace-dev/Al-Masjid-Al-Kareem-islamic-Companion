#!/bin/bash

# 🚀 Quick Deployment Script for Muslim Companion App
# This script automates the GitHub + Vercel deployment process

echo "🕌 Muslim Companion App - Deployment Script"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Pre-flight checks..."

# Check git status
if ! git status &>/dev/null; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

echo "✅ Git repository detected"

# Check if remote origin exists
if git remote get-url origin &>/dev/null; then
    echo "✅ GitHub remote already configured"
    REPO_URL=$(git remote get-url origin)
    echo "   Repository: $REPO_URL"
else
    echo "⚠️  No GitHub remote found"
    read -p "📝 Enter your GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
    echo "✅ GitHub remote added: $REPO_URL"
fi

# Commit any pending changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Committing pending changes..."
    git add .
    git commit -m "chore: Final deployment preparation

- Update deployment configuration
- Add deployment guide and scripts
- Ready for Vercel serverless deployment"
    echo "✅ Changes committed"
else
    echo "✅ No pending changes to commit"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main
echo "✅ Code pushed to GitHub successfully!"

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com and sign in with GitHub"
echo "2. Click 'New Project' and import your repository"
echo "3. Vercel will auto-detect settings from vercel.json"
echo "4. Click 'Deploy' and wait for deployment to complete"
echo ""
echo "📱 Your app will be available at: https://your-app-name.vercel.app"
echo ""
echo "🔧 Don't forget to set environment variables in Vercel:"
echo "   - SECRET_KEY: your-flask-secret-key"
echo "   - PYTHON_VERSION: 3.9"
echo ""
echo "🕌 May Allah bless this deployment! Ameen."