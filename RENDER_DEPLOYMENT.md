# 🚀 Render Deployment Guide - Muslim Companion App

## 📋 Quick Deployment Checklist

✅ **Backend Requirements**: `requirements.txt` with gunicorn  
✅ **Backend Procfile**: Created for Render  
✅ **CORS Configuration**: Updated for production  
✅ **Environment Variables**: Configured for local/production  
✅ **Database**: SQLite compatible with both environments  

## 🔧 Step 1: Deploy Backend on Render

1. **Go to Render Dashboard**
   - Visit: https://render.com
   - Sign up with GitHub account
   - Connect your repository: `Al-Masjid-Al-Kareem-islamic-Companion`

2. **Create Web Service for Backend**
   - Click **"New +"** → **"Web Service"**
   - Select your GitHub repository
   - Configure settings:

   ```
   Name: muslim-companion-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

3. **Set Environment Variables** (Optional)
   ```
   RENDER=true
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-here
   ```

4. **Deploy Backend**
   - Click **"Create Web Service"**
   - Wait 2-3 minutes for deployment
   - Note your backend URL: `https://muslim-companion-backend.onrender.com`

## 🌐 Step 2: Deploy Frontend on Render

1. **Create Static Site for Frontend**
   - Click **"New +"** → **"Static Site"**
   - Select same GitHub repository
   - Configure settings:

   ```
   Name: muslim-companion-frontend
   Root Directory: frontend
   Build Command: npm run build
   Publish Directory: dist
   ```

2. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://muslim-companion-backend.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

3. **Deploy Frontend**
   - Click **"Create Static Site"**
   - Wait 2-3 minutes for build and deployment
   - Your frontend URL: `https://muslim-companion-frontend.onrender.com`

## 🔗 Step 3: Update CORS for Production

After deployment, update the backend CORS configuration:

1. **Edit `backend/app.py`** (line 25-35):
   ```python
   if os.environ.get('RENDER'):
       cors.init_app(app, origins=[
           "https://muslim-companion-frontend.onrender.com",  # Your actual frontend URL
           "http://localhost:3000"  # Keep for local development
       ])
   ```

2. **Redeploy Backend**
   - Render auto-deploys on git push
   - Or manually redeploy from Render dashboard

## 🌟 Local Development Setup

For local development, everything works as before:

```bash
# Backend (Terminal 1)
cd backend
python app.py

# Frontend (Terminal 2)  
cd frontend
npm run dev
```

## 📱 Environment Configuration

### Local Environment (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

### Production Environment (Render)
```env
REACT_APP_API_URL=https://muslim-companion-backend.onrender.com
REACT_APP_ENVIRONMENT=production
```

## 🔧 File Structure After Setup

```
backend/
├── app.py                 # ✅ Updated for Render compatibility
├── config.py              # ✅ Updated database paths
├── requirements.txt       # ✅ Added gunicorn
├── Procfile              # ✅ Created for Render
└── ...

frontend/
├── .env                  # ✅ Local development
├── .env.production       # ✅ Production template
├── src/services/api.js   # ✅ Environment-aware API calls
└── ...
```

## 🚀 Deployment URLs

After successful deployment:

- **Frontend**: https://muslim-companion-frontend.onrender.com
- **Backend**: https://muslim-companion-backend.onrender.com
- **API Health**: https://muslim-companion-backend.onrender.com/

## 🔍 Testing Deployment

1. **Test Backend API**:
   ```bash
   curl https://muslim-companion-backend.onrender.com/
   ```

2. **Test Frontend**:
   - Open: https://muslim-companion-frontend.onrender.com
   - Check browser console for API connectivity

3. **Test Login**:
   - Username: `admin`
   - Password: `admin123`

## 🛠 Troubleshooting

### Backend Issues
- Check Render logs for Python errors
- Verify `requirements.txt` includes all dependencies
- Ensure `Procfile` points to correct app instance

### Frontend Issues
- Check build logs for npm errors
- Verify `REACT_APP_API_URL` environment variable
- Check browser console for CORS errors

### CORS Issues
- Update backend CORS with exact frontend URL
- Remove wildcards for production security

## 💡 Pro Tips

1. **Free Tier Limits**:
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds

2. **Custom Domain** (Optional):
   - Add custom domain in Render dashboard
   - Update CORS configuration accordingly

3. **Database Persistence**:
   - Current setup uses SQLite (resets on redeploy)
   - For persistence, upgrade to Render PostgreSQL

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Backend responds at Render URL
- ✅ Frontend loads at Render URL  
- ✅ Login works with admin credentials
- ✅ API calls succeed from frontend to backend
- ✅ Local development still works

---

**🎉 Your Muslim Companion app is now live on the internet!**

Share your Render URLs:
- **App**: https://muslim-companion-frontend.onrender.com
- **API**: https://muslim-companion-backend.onrender.com