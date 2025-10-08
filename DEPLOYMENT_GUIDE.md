# 🚀 Deployment Guide - Muslim Companion App

## Overview
This guide covers deploying the Muslim Companion App to Vercel with serverless functions.

## Architecture
- **Frontend**: React + Vite (Static deployment)
- **Backend**: Flask API (Serverless functions)
- **Database**: SQLite (Vercel uses /tmp for serverless)
- **Hosting**: Vercel (Free tier)

## 📋 Pre-deployment Checklist

### 1. Create GitHub Repository
1. Go to https://github.com and create a new repository
2. Name: `muslim-companion-app`
3. Make it **Public** (required for free Vercel)
4. Don't initialize with README

### 2. Connect Local Repository to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/muslim-companion-app.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Go to https://vercel.com and sign up/login with GitHub
2. Click "New Project"
3. Import your `muslim-companion-app` repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: muslim-companion-app
# - Directory: ./
# - Override settings? No
```

## 🔧 Configuration Files

### vercel.json
- **Purpose**: Configures Vercel deployment
- **Backend**: Python 3.9 serverless functions
- **Frontend**: Static React build
- **Routes**: API calls go to `/api/*`

### api/index.py
- **Purpose**: Serverless entry point
- **Function**: Exports Flask app for Vercel

### Environment Variables
Set these in Vercel dashboard under Project Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `PYTHON_VERSION` | `3.9` | Python runtime version |
| `SECRET_KEY` | `your-secret-key` | Flask secret key |

## 🎯 Post-Deployment Testing

### API Endpoints
Test these endpoints after deployment:
- `https://your-app.vercel.app/api/` - Health check
- `https://your-app.vercel.app/api/auth/register` - User registration
- `https://your-app.vercel.app/api/prayer/times` - Prayer times
- `https://your-app.vercel.app/api/quran/verses` - Quran verses

### Frontend Features
- User authentication (register/login)
- Prayer times display
- Quran reading interface
- Hadith collections
- Admin panel access

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check logs in Vercel dashboard
# Common fix: Update Python dependencies
```

#### 2. Database Issues
- Vercel uses `/tmp` directory for SQLite
- Database is recreated on each function invocation
- Consider migrating to PostgreSQL for persistence

#### 3. CORS Errors
- Vercel domains are pre-configured in CORS
- Check console for specific origins

#### 4. API Not Found (404)
- Ensure `api/index.py` exists
- Check `vercel.json` route configuration

### Debug Commands
```bash
# Check local build
cd frontend && npm run build

# Test API locally
cd backend && python app.py

# Check Git status
git status
git log --oneline -10
```

## 📊 Performance Optimization

### Frontend
- React build is optimized by Vite
- Static assets served from CDN
- Gzip compression enabled

### Backend
- Serverless functions cold start ~500ms
- Keep functions warm with periodic requests
- Optimize imports for faster startup

## 🔮 Future Enhancements

### Database Migration
Consider upgrading to PostgreSQL:
1. Create Vercel Postgres database
2. Update `backend/config.py`
3. Add connection string to environment variables

### Authentication
- Implement OAuth with Google/Facebook
- Add email verification
- Session persistence improvements

## 📞 Support

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Flask on Vercel Guide](https://vercel.com/guides/deploying-flask-with-vercel)
- [React Deployment](https://vitejs.dev/guide/static-deploy.html)

### Project Repository
- GitHub: `https://github.com/YOUR_USERNAME/muslim-companion-app`
- Live Demo: `https://your-app.vercel.app`

---

🕌 **May Allah bless this project and make it beneficial for the Muslim community! Ameen.**