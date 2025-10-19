import os
from datetime import timedelta

class Config:
    """Flask configuration class"""

    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ancient-rich-islamic-app-secret-key-2025'

    # Database configuration - Compatible with Railway, local, Render, and Vercel
    basedir = os.path.abspath(os.path.dirname(__file__))
    
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        # Railway deployment - use PostgreSQL DATABASE_URL
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
        if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
            # Fix for SQLAlchemy 1.4+ compatibility
            SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    elif os.environ.get('VERCEL'):
        # Vercel serverless - use temporary SQLite or environment database
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:////tmp/muslim_lifestyle.db'
    elif os.environ.get('RENDER'):
        # Production on Render - use DATABASE_URL if provided, otherwise SQLite in current directory
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///muslim_lifestyle.db'
    else:
        # Local development - use the existing instance folder
        instance_path = os.path.join(basedir, "instance", "muslim_lifestyle.db")
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{instance_path}'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string-for-ancient-rich-theme'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = 'HS256'

    # CORS configuration
    CORS_HEADERS = 'Content-Type'

    # Upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'static/uploads'

    # API configuration
    ITEMS_PER_PAGE = 20

    # Islamic APIs
    ALADHAN_API_URL = 'http://api.aladhan.com/v1'
    ALQURAN_API_URL = 'http://api.alquran.cloud/v1'
    HADITH_API_URL = 'https://hadithapi.com/api'

    # Google Maps API
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY') or 'your-google-maps-api-key'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # Railway will provide DATABASE_URL automatically
    if os.environ.get('RAILWAY_ENVIRONMENT'):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
        if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
            SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    else:
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:password@localhost/muslim_lifestyle_prod'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
