# Muslim Lifestyle App - Troubleshooting Guide

## Common Issues and Solutions

### 404 Error when accessing the frontend

If you're experiencing a 404 error when trying to access the frontend at http://localhost:3000/, try the following:

1. **Ensure both servers are running**
   - Backend should be running on port 5000
   - Frontend should be running on port 3000
   - Use the `Start-MuslimApp.ps1` script to start both servers

2. **Check direct connections**
   - Try accessing http://localhost:3000/test.html to see if the test page loads
   - Try accessing http://localhost:5000/api/health to see if the backend is responding

3. **Clear browser cache**
   - Press Ctrl+F5 or use incognito/private mode to bypass cache

4. **Fix for 404 errors on direct URL access**
   - The React app uses client-side routing, which requires server support
   - Add the following to your vite.config.js to solve this issue:
   ```javascript
   server: {
     port: 3000,
     strictPort: true,
     open: true,
     proxy: {
       '/api': {
         target: 'http://127.0.0.1:5000',
         changeOrigin: true,
         secure: false
       }
     }
   }
   ```

5. **Create a 404.html redirect page**
   - Add a 404.html file in the public folder that redirects to index.html
   - This helps with direct URL access and refreshing pages

### Backend not connecting

If the backend is not connecting or responding with errors:

1. **Check if the server is running**
   - Run `cd backend && python app.py` to start the server
   - Look for any error messages in the console

2. **Check for port conflicts**
   - Make sure no other application is using port 5000
   - Run `netstat -ano | findstr :5000` to check if the port is in use

3. **Check database connectivity**
   - Ensure the SQLite database file exists and is accessible
   - Check for database errors in the console output

### Login issues

If you're experiencing problems with login:

1. **Use the default credentials**
   - Username: admin
   - Password: admin123

2. **Try the offline mode**
   - The app has a fallback for admin login when the backend is unavailable
   - Enter admin / admin123 and the app will use mock data

## Quick Start Guide

For a fresh start, follow these steps:

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd muslim-lifestyle-app
   ```

2. **Install dependencies**
   ```
   cd backend
   pip install -r requirements.txt
   cd ../frontend
   npm install
   ```

3. **Start the application**
   ```
   powershell -ExecutionPolicy Bypass -File .\Start-MuslimApp.ps1
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api/health
   - Test page: http://localhost:3000/test.html

## Need more help?

If you're still experiencing issues, try the diagnostic script:
```
powershell -ExecutionPolicy Bypass -File .\Simple-Check.ps1
```

This script will check both servers and provide specific error messages to help troubleshoot the issues.
