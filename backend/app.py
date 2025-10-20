#!/usr/bin/env python3
"""
Qareeb - Islamic Companion App Backend
A comprehensive Islamic companion app
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import subprocess
import sys
import time
import threading

# Railway compatibility - add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import config with Railway compatibility
try:
    from config import Config
except ImportError:
    # Fallback for different deployment scenarios
    try:
        from backend.config import Config
    except ImportError:
        # Last resort - direct path
        import importlib.util
        config_path = os.path.join(os.path.dirname(__file__), 'config.py')
        spec = importlib.util.spec_from_file_location("config", config_path)
        config_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(config_module)
        Config = config_module.Config

# Import extensions with Railway compatibility
try:
    from extensions import db, cors, jwt
except ImportError:
    # Fallback for Railway deployment
    try:
        from backend.extensions import db, cors, jwt
    except ImportError:
        # Last resort - direct path
        import importlib.util
        ext_path = os.path.join(os.path.dirname(__file__), 'extensions.py')
        spec = importlib.util.spec_from_file_location("extensions", ext_path)
        ext_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(ext_module)
        db, cors, jwt = ext_module.db, ext_module.cors, ext_module.jwt

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Debug environment variables for Railway
if os.environ.get('RAILWAY_ENVIRONMENT'):
    print("🚂 Railway Environment Variables:")
    print(f"DATABASE_URL: {'✅ Set' if os.environ.get('DATABASE_URL') else '❌ Missing'}")
    print(f"SECRET_KEY: {'✅ Set' if os.environ.get('SECRET_KEY') else '❌ Missing'}")
    print(f"JWT_SECRET_KEY: {'✅ Set' if os.environ.get('JWT_SECRET_KEY') else '❌ Missing'}")
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')
    print(f"Final DB URI: {db_uri[:50]}...")

# Initialize extensions with app
db.init_app(app)

# CORS configuration - Allow Railway, local, Render, and Vercel origins
if os.environ.get('RAILWAY_ENVIRONMENT'):
    # Railway deployment CORS
    cors.init_app(app, origins=[
        "https://*.railway.app",
        "https://*.up.railway.app",
        "http://localhost:3000", 
        "http://127.0.0.1:3000"
    ])
elif os.environ.get('VERCEL'):
    # Vercel deployment CORS
    cors.init_app(app, origins=[
        "https://*.vercel.app",
        "https://muslim-companion.vercel.app",
        "http://localhost:3000", 
        "http://127.0.0.1:3000"
    ])
elif os.environ.get('RENDER'):
    # Production CORS - Update with your actual Render frontend URL
    cors.init_app(app, origins=[
        "https://*.onrender.com",
        "http://localhost:3000", 
        "http://127.0.0.1:3000"
    ])
else:
    # Development CORS
    cors.init_app(app, origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001"
    ])

jwt.init_app(app)

# Import models after extensions initialization
# Import models with Railway compatibility
try:
    from models import User, PrayerTime, RamadanArrangement, Bookmark, UserPreference
except ImportError:
    from backend.models import User, PrayerTime, RamadanArrangement, Bookmark, UserPreference

# Import routes with Railway compatibility
try:
    from routes.auth import auth_bp
    from routes.prayer import prayer_bp
    from routes.quran import quran_bp
    from routes.hadith import hadith_bp
    from routes.arrangements import arrangements_bp
    from routes.admin import admin_bp
except ImportError:
    from backend.routes.auth import auth_bp
    from backend.routes.prayer import prayer_bp
    from backend.routes.quran import quran_bp
    from backend.routes.hadith import hadith_bp
    from backend.routes.arrangements import arrangements_bp
    from backend.routes.admin import admin_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prayer_bp, url_prefix='/api/prayer')
app.register_blueprint(quran_bp, url_prefix='/api/quran')
app.register_blueprint(hadith_bp, url_prefix='/api/hadith')
app.register_blueprint(arrangements_bp, url_prefix='/api/arrangements')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Static file serving for production (Railway)
@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve the React frontend in production"""
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        # In production, serve the built React app
        static_folder = os.path.join(app.root_path, 'static')
        index_path = os.path.join(static_folder, 'index.html')
        
        print(f"🌐 Static folder: {static_folder}")
        print(f"📁 Static folder exists: {os.path.exists(static_folder)}")
        print(f"📄 Index.html exists: {os.path.exists(index_path)}")
        
        if os.path.exists(static_folder):
            print(f"📂 Static folder contents: {os.listdir(static_folder)}")
        
        if os.path.exists(index_path):
            return send_from_directory(static_folder, 'index.html')
        else:
            print("❌ index.html not found, serving fallback HTML")
            # Serve a basic HTML page as fallback
            return '''
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Qareeb - Islamic Companion</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                    .container { max-width: 600px; margin: 0 auto; }
                    h1 { font-size: 2.5em; margin-bottom: 20px; }
                    p { font-size: 1.2em; margin: 20px 0; }
                    .api-link { color: #ffd700; text-decoration: none; }
                    .api-link:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🕌 Qareeb</h1>
                    <h2>Islamic Companion</h2>
                    <p>Your Islamic companion app is successfully deployed!</p>
                    <p>Frontend is currently being built. Please check back in a few minutes.</p>
                    <p>API is available at: <a href="/api/health" class="api-link">/api/health</a></p>
                    <p>Admin Login: ahilxdesigns@gmail.com / Qareeb@2025</p>
                </div>
            </body>
            </html>
            '''
    
    # Development or fallback API response
    return jsonify({
        'message': 'Qareeb Islamic Companion API - Use /api endpoints to access resources',
        'frontend': 'Run npm run dev in frontend folder for development',
        'note': 'Frontend static files not found - check build process'
    })

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files for the frontend"""
    static_folder = os.path.join(app.root_path, 'static')
    return send_from_directory(static_folder, filename)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Qareeb Islamic Companion Backend is running',
        'timestamp': datetime.utcnow().isoformat(),
        'environment': 'railway' if os.environ.get('RAILWAY_ENVIRONMENT') else 'development'
    })

# Catch-all route to handle unknown routes and serve React app
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    """Handle unknown routes - serve React app in production or API response in development"""
    # Don't serve frontend for API routes
    if path.startswith('api/'):
        return jsonify({
            'message': f'The requested API path /{path} does not exist',
            'available_endpoints': [
                '/api/health',
                '/api/auth/login',
                '/api/auth/register',
                '/api/prayer',
                '/api/quran',
                '/api/hadith'
            ]
        }), 404
    
    # In production (Railway), serve the React app for all non-API routes
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        static_folder = os.path.join(app.root_path, 'static')
        if os.path.exists(os.path.join(static_folder, 'index.html')):
            return send_from_directory(static_folder, 'index.html')
    
    # Development fallback
    return jsonify({
        'message': f'The requested path /{path} does not exist',
        'note': 'Start the React development server for frontend routes'
    }), 404

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    """Dashboard data with prayer times and Islamic calendar"""
    current_user = get_jwt_identity()

    # Get current prayer times (mock data)
    prayer_times = {
        'Delhi': {
            'Fajr': '04:25', 'Dhuhr': '12:10', 'Asr': '15:45', 
            'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:15'
        }
    }

    # Islamic calendar events
    islamic_events = {
        'Ramadan': {'start': '2025-02-28', 'end': '2025-03-30'},
        'Eid_al_Fitr': {'date': '2025-03-30'},
        'Eid_al_Adha': {'date': '2025-06-06'}
    }

    return jsonify({
        'user': current_user,
        'prayer_times': prayer_times,
        'islamic_events': islamic_events,
        'message': 'Welcome to your Islamic companion'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

def create_tables():
    """Create database tables"""
    # Ensure instance directory exists for local development
    if not os.environ.get('RENDER') and not os.environ.get('VERCEL'):
        instance_dir = os.path.join(os.path.dirname(__file__), 'instance')
        if not os.path.exists(instance_dir):
            os.makedirs(instance_dir)
            print("📁 Created instance directory for database")
    
    # For Vercel, ensure /tmp directory access
    if os.environ.get('VERCEL'):
        import tempfile
        os.makedirs('/tmp', exist_ok=True)
    
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

        # Create default admin user
        if not User.query.filter_by(username='ahilxdesigns@gmail.com').first():
            admin_user = User(
                username='ahilxdesigns@gmail.com',
                email='ahilxdesigns@gmail.com',
                password_hash=generate_password_hash('Qareeb@2025'),
                role='admin'
            )
            db.session.add(admin_user)

        # Create default arranger user
        if not User.query.filter_by(username='organizer1').first():
            organizer_user = User(
                username='organizer1',
                email='org1@muslim-app.com',
                password_hash=generate_password_hash('org123'),
                role='arranger'
            )
            db.session.add(organizer_user)

        db.session.commit()
        print("✅ Default users created successfully!")

def start_frontend_server():
    """Start the React frontend development server"""
    try:
        frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend')
        if os.path.exists(frontend_path):
            print("🌐 Starting React frontend server on port 3000...")
            # Use npm run dev to start the Vite development server
            # Set environment variable to avoid port conflict prompts
            env = os.environ.copy()
            env['VITE_PORT'] = '3000'
            subprocess.Popen(['npm', 'run', 'dev'], cwd=frontend_path, shell=True, env=env)
        else:
            print("⚠️  Frontend directory not found, skipping frontend server startup")
    except Exception as e:
        print(f"❌ Error starting frontend server: {e}")

if __name__ == '__main__':
    create_tables()
    print("🕌 Starting Qareeb Islamic Companion Application...")
    print("🌟 Islamic Companion Full Stack Application")
    
    # Check if we're in production environment
    is_production = bool(os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('RENDER') or os.environ.get('VERCEL'))
    
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        print("🚂 Running on Railway")
        print("📊 Database: PostgreSQL (Railway)")
    elif is_production:
        print("☁️  Running in production")
        print("📊 Database: Production")
    else:
        print("💻 Running in development")
        print("📊 Database: SQLite (development)")
    
    print("🔑 Default admin: ahilxdesigns@gmail.com / Qareeb@2025")
    
    if not is_production:
        # Start frontend server in a separate thread for local development
        print("🚀 Starting both frontend and backend servers...")
        frontend_thread = threading.Thread(target=start_frontend_server, daemon=True)
        frontend_thread.start()
        time.sleep(3)  # Give frontend server time to start
    else:
        print("🌐 Frontend served from static files")
    
    # Get port from environment variable or default to 5000 (local)
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if is_production else '127.0.0.1'
    debug = not is_production
    
    print(f"🏛️  Backend server starting on http://{host}:{port}")
    if not is_production:
        print(f"🌐 Frontend server will start on http://localhost:3000 (or next available port)")
    print("📖 Qareeb - Your Islamic Companion is ready!")
    
    app.run(debug=debug, host=host, port=port)
