# 🚂 Railway Deployment Guide for Qareeb Islamic Companion

## 🎯 Quick Deploy to Railway

### 1. **Prepare Your Repository**
Your app is already configured for Railway! The following files are ready:
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Railway startup command
- ✅ `nixpacks.toml` - Build configuration
- ✅ Railway-compatible Flask app

### 2. **Deploy to Railway**

#### Option A: GitHub Integration (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `Al-Masjid-Al-Kareem-islamic-Companion` repository
5. Railway will auto-detect and deploy!

#### Option B: CLI Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 3. **Configure Environment Variables**
In Railway dashboard, add these environment variables:

**Required:**
```
SECRET_KEY=your-super-secure-secret-key-2025
JWT_SECRET_KEY=your-jwt-secret-key-2025
RAILWAY_ENVIRONMENT=true
```

**Optional:**
```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. **Add PostgreSQL Database**
1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Railway automatically sets `DATABASE_URL`

## 🎉 **Your App Will Be Live!**
- **Backend API**: `https://your-app.railway.app/api/health`
- **Frontend**: `https://your-app.railway.app`
- **Admin Login**: `ahilxdesigns@gmail.com` / `Qareeb@2025`

## 🔧 **What Railway Does Automatically**
1. **Detects** Python + Node.js app
2. **Installs** Python dependencies
3. **Builds** React frontend (`npm run build`)
4. **Copies** built files to Flask static folder
5. **Starts** Gunicorn server
6. **Provides** free PostgreSQL database
7. **Enables** HTTPS with custom domain

## 📊 **Railway Pricing**
- **$5/month** usage credit (perfect for this app)
- **Free PostgreSQL** database
- **Custom domains** included
- **Automatic HTTPS** certificates

## 🚨 **Troubleshooting**
If deployment fails:
1. Check build logs in Railway dashboard
2. Verify all files are committed to Git
3. Ensure `requirements.txt` is in root directory
4. Check environment variables are set

## 🔄 **Auto-Deploy**
Every Git push to main branch automatically redeploys your app!

---
**Need Help?** Check Railway docs: https://docs.railway.app