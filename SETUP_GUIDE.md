# Muslim Lifestyle App - Complete Setup Guide

This guide provides step-by-step instructions for setting up both the backend and frontend of the Muslim Lifestyle App.

## System Requirements

- Python 3.9+ for the backend
- Node.js 16+ for the frontend
- SQLite (or any other database configured in config.py)

## Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd "c:\Users\thous\Downloads\final muslim app\New folder\backend"
   ```

2. **Install required Python packages**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application**
   ```bash
   python app.py
   ```

   The backend should start running on http://127.0.0.1:5000

4. **Default Admin Credentials**
   - Username: `admin`
   - Password: `admin123`

## Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd "c:\Users\thous\Downloads\final muslim app\New folder\frontend"
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend should start running on http://localhost:3000

## Troubleshooting

### Backend Issues

1. **Database Connection**
   - Check if the SQLite database exists at `backend/instance/muslim_lifestyle.db`
   - If not, the application should create it automatically

2. **API Routes**
   - Test individual API endpoints using the test.html page or tools like Postman
   - Example: http://127.0.0.1:5000/api/health should return a JSON response

### Frontend Issues

1. **Proxy Configuration**
   - Verify that vite.config.js has the correct proxy setting:
     ```javascript
     proxy: {
       '/api': {
         target: 'http://127.0.0.1:5000',
         changeOrigin: true,
         secure: false
       }
     }
     ```

2. **Authentication**
   - Check browser console for authentication errors
   - Use the default admin credentials: admin/admin123

3. **Blank Page Issues**
   - If you see a blank page, check browser console for JavaScript errors
   - Try navigating directly to http://localhost:3000/test.html to test connectivity

## Architecture Overview

### Backend Structure

- **app.py**: Main application entry point
- **models.py**: Database models
- **config.py**: Configuration settings
- **routes/**: API endpoints organized by feature
  - auth.py: Authentication endpoints
  - prayer.py: Prayer times functionality
  - quran.py: Quran content endpoints
  - hadith.py: Hadith collection endpoints
  - arrangements.py: Community arrangements

### Frontend Structure

- **src/components/**: Reusable UI components
- **src/pages/**: Page components for each route
- **src/context/**: React context providers
- **src/services/**: API service functions

## Common Operations

### Add a New API Endpoint

1. Create a route in the appropriate file in `backend/routes/`
2. Add the endpoint function to the API service in `frontend/src/services/api.js`
3. Use the API function in your React component

### Add a New Page

1. Create a new component in `frontend/src/pages/`
2. Add a route in `frontend/src/App.jsx`

## Support

For any issues, please contact the development team.
