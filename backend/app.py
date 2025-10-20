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
    
    # Print all environment variables containing 'DATABASE' or 'POSTGRES'
    print("🔍 Database-related environment variables:")
    for key, value in os.environ.items():
        if any(keyword in key.upper() for keyword in ['DATABASE', 'POSTGRES', 'PG']):
            print(f"  {key}: {value[:50]}...")
    
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')
    print(f"Final DB URI: {db_uri[:50]}...")

# Initialize extensions with app
try:
    # Check if db is already initialized to prevent double registration
    if hasattr(app, 'extensions') and 'sqlalchemy' in app.extensions:
        print("⚠️ SQLAlchemy already initialized, skipping...")
    else:
        db.init_app(app)
        print("✅ Database initialized successfully")
except Exception as e:
    print(f"❌ Database initialization failed: {e}")
    # Don't try to reinitialize if already done
    if "already been registered" not in str(e):
        print("🔄 Attempting SQLite fallback...")
        # Force SQLite fallback
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emergency_fallback.db'
        try:
            db.init_app(app)
            print("✅ SQLite fallback initialized")
        except Exception as fallback_error:
            print(f"❌ SQLite fallback also failed: {fallback_error}")
    else:
        print("⚠️ Database already registered, continuing...")

# CORS configuration - More permissive for troubleshooting
print("🔗 Configuring CORS...")
cors.init_app(app, 
    origins="*",  # Allow all origins for now
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    supports_credentials=True
)
print("✅ CORS configured (permissive mode)")

jwt.init_app(app)

# Import models after extensions initialization
# Import models with Railway compatibility
try:
    from models import User, PrayerTime, RamadanArrangement, Bookmark, UserPreference
except ImportError:
    from backend.models import User, PrayerTime, RamadanArrangement, Bookmark, UserPreference

# Import routes with Railway compatibility and debugging
try:
    print("🔄 Importing routes (local path)...")
    from routes.auth import auth_bp
    from routes.prayer import prayer_bp
    from routes.quran import quran_bp
    from routes.hadith import hadith_bp
    from routes.arrangements import arrangements_bp
    from routes.admin import admin_bp
    print("✅ Local route imports successful")
except ImportError as e:
    print(f"⚠️ Local route import failed: {e}")
    print("🔄 Importing routes (backend path)...")
    try:
        from backend.routes.auth import auth_bp
        from backend.routes.prayer import prayer_bp
        from backend.routes.quran import quran_bp
        from backend.routes.hadith import hadith_bp
        from backend.routes.arrangements import arrangements_bp
        from backend.routes.admin import admin_bp
        print("✅ Backend route imports successful")
    except ImportError as e2:
        print(f"❌ Backend route import also failed: {e2}")
        raise e2

# Register blueprints with debugging
print("🔗 Registering blueprints...")
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prayer_bp, url_prefix='/api/prayer')
app.register_blueprint(quran_bp, url_prefix='/api/quran')
app.register_blueprint(hadith_bp, url_prefix='/api/hadith')
app.register_blueprint(arrangements_bp, url_prefix='/api/arrangements')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
print("✅ All blueprints registered successfully")

# Static file serving for production (Railway)
@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve the React frontend"""
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        # In production, serve the React build
        static_folder = os.path.join(app.root_path, 'static')
        index_path = os.path.join(static_folder, 'index.html')
        
        print(f"🌐 Static folder: {static_folder}")
        print(f"📁 Static folder exists: {os.path.exists(static_folder)}")
        print(f"📄 React index.html exists: {os.path.exists(index_path)}")
        
        if os.path.exists(static_folder):
            print(f"📂 Static folder contents: {os.listdir(static_folder)}")
        
        if os.path.exists(index_path):
            print("✅ Serving React application")
            return send_from_directory(static_folder, 'index.html')
        else:
            print("❌ React build not found - check build logs")
            return jsonify({
                'error': 'React application not built',
                'message': 'React build failed during deployment',
                'solution': 'Check Railway build logs for frontend build errors',
                'api_available': True,
                'endpoints': {
                    'health': '/api/health',
                    'auth': '/api/auth/login',
                    'prayer': '/api/prayer',
                    'quran': '/api/quran'
                }
            }), 503
    else:
        # In development mode, return a message for React dev server
        return jsonify({
            'message': 'Development mode - start React dev server on port 5173',
            'backend_port': '5001',
            'react_dev_command': 'cd frontend && npm run dev'
        })


# Catch-all route to serve React routes (SPA routing)
@app.route('/<path:path>')
def catch_all(path):
    """Catch-all route for React Router SPA routing"""
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
        index_path = os.path.join(static_folder, 'index.html')
        
        # Serve static assets (JS, CSS, images) if they exist
        file_path = os.path.join(static_folder, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            print(f"📄 Serving static file: {path}")
            return send_from_directory(static_folder, path)
        
        # For all other routes, serve React app (SPA routing)
        if os.path.exists(index_path):
            print(f"🔄 SPA routing for: {path}")
            return send_from_directory(static_folder, 'index.html')
        else:
            print(f"❌ React build not found for route: {path}")
            return jsonify({'error': 'React application not built', 'route': path}), 404
    else:
        # Development mode - serve React app if built, otherwise inform about dev server
        static_folder = os.path.join(app.root_path, 'static')
        index_path = os.path.join(static_folder, 'index.html')
        
        if os.path.exists(index_path):
            # Serve static assets
            file_path = os.path.join(static_folder, path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return send_from_directory(static_folder, path)
            # Serve React app for SPA routing
            return send_from_directory(static_folder, 'index.html')
        else:
            # No React build found - inform about development setup
            return jsonify({
                'message': 'Qareeb Islamic Companion API - Development Mode',
                'frontend': 'Run npm run dev in frontend folder for React development server',
                'backend': 'API endpoints available under /api/',
                'note': 'React build not found - use npm run build to create production build'
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

@app.route('/api/debug/routes', methods=['GET'])
def debug_routes():
    """Debug endpoint to list all registered routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'url': str(rule)
        })
    return jsonify({
        'total_routes': len(routes),
        'routes': sorted(routes, key=lambda x: x['url'])
    })

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors with helpful information"""
    return jsonify({
        'error': 'Not Found',
        'message': f'The requested URL {request.url} was not found on the server.',
        'available_api_endpoints': [
            '/api/health',
            '/api/debug/routes',
            '/api/auth/login',
            '/api/auth/register', 
            '/api/quran/chapters',
            '/api/quran/para/1/surahs',
            '/api/hadith/collections',
            '/api/admin/users'
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An internal server error occurred.'
    }), 500

# This route is already defined above - no duplicate needed
    
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
