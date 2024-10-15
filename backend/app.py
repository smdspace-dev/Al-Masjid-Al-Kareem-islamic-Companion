#!/usr/bin/env python3
"""
Muslim Lifestyle App - Flask Backend
A comprehensive Islamic companion app for Indian Muslims
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from config import Config

# Import extensions
from extensions import db, cors, jwt

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions with app
db.init_app(app)
cors.init_app(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"])
jwt.init_app(app)

# Import models after extensions initialization
from models import User, PrayerTime, RamadanArrangement, Bookmark, UserPreference

# Import routes
from routes.auth import auth_bp
from routes.prayer import prayer_bp
from routes.quran import quran_bp
from routes.hadith import hadith_bp
from routes.arrangements import arrangements_bp
from routes.admin import admin_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prayer_bp, url_prefix='/api/prayer')
app.register_blueprint(quran_bp, url_prefix='/api/quran')
app.register_blueprint(hadith_bp, url_prefix='/api/hadith')
app.register_blueprint(arrangements_bp, url_prefix='/api/arrangements')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Muslim Lifestyle API - Use /api endpoints to access resources'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Muslim Lifestyle App Backend is running',
        'timestamp': datetime.utcnow().isoformat()
    })

# Catch-all route to handle unknown routes
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    """Handle all unknown routes gracefully"""
    return jsonify({
        'message': f'The requested path /{path} does not exist',
        'available_endpoints': [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/me',
            '/api/prayer/times/<city>',
            '/api/quran/surahs',
            '/api/hadith/collections',
            '/api/arrangements'
        ]
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
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

        # Create default admin user
        if not User.query.filter_by(username='admin').first():
            admin_user = User(
                username='admin',
                email='admin@muslim-app.com',
                password_hash=generate_password_hash('admin123'),
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

if __name__ == '__main__':
    create_tables()
    print("🕌 Starting Muslim Lifestyle App Backend...")
    print("🌟 Ancient Rich Theme - Classical Islamic Companion")
    print("📊 Database: SQLite (development)")
    print("🔑 Default admin: admin / admin123")
    print("🏛️  Server starting on http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
