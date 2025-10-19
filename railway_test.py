#!/usr/bin/env python3
"""
Local Railway Environment Simulation
Tests the app as it would run on Railway
"""

import os
import subprocess
import sys

def setup_railway_env():
    """Set up environment variables to simulate Railway"""
    os.environ['RAILWAY_ENVIRONMENT'] = 'true'
    os.environ['FLASK_ENV'] = 'production'
    os.environ['NODE_ENV'] = 'production'
    os.environ['SECRET_KEY'] = 'railway-test-secret-key-2025'
    os.environ['JWT_SECRET_KEY'] = 'railway-test-jwt-secret-2025'
    # Use SQLite for local testing (Railway will use PostgreSQL)
    os.environ['DATABASE_URL'] = 'sqlite:///railway_test.db'

def build_frontend():
    """Build the React frontend"""
    print("🔨 Building React frontend...")
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'], 
            cwd='frontend', 
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Frontend build successful")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend build failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def copy_frontend_files():
    """Copy built frontend files to backend static folder"""
    print("📁 Copying frontend files to backend static folder...")
    try:
        import shutil
        
        # Create static directory if it doesn't exist
        static_dir = 'backend/static'
        if os.path.exists(static_dir):
            shutil.rmtree(static_dir)
        os.makedirs(static_dir, exist_ok=True)
        
        # Copy built files
        if os.path.exists('frontend/dist'):
            for item in os.listdir('frontend/dist'):
                src = os.path.join('frontend/dist', item)
                dst = os.path.join(static_dir, item)
                if os.path.isdir(src):
                    shutil.copytree(src, dst)
                else:
                    shutil.copy2(src, dst)
            print("✅ Frontend files copied successfully")
            return True
        else:
            print("❌ Frontend dist folder not found")
            return False
    except Exception as e:
        print(f"❌ Error copying files: {e}")
        return False

def start_app():
    """Start the app using Gunicorn (like Railway)"""
    print("🚀 Starting app with Gunicorn (Railway simulation)...")
    try:
        # Install gunicorn if not present
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'gunicorn'], check=True)
        
        # Start with gunicorn
        subprocess.run([
            'gunicorn', 
            'backend.app:app', 
            '--bind', '0.0.0.0:8080',
            '--workers', '1',
            '--timeout', '120'
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start app: {e}")
        return False
    except KeyboardInterrupt:
        print("\n🛑 App stopped by user")
        return True

def main():
    """Main function to simulate Railway deployment locally"""
    print("🚂 Railway Local Simulation")
    print("=" * 40)
    
    # Setup environment
    setup_railway_env()
    print("✅ Railway environment variables set")
    
    # Build frontend
    if not build_frontend():
        sys.exit(1)
    
    # Copy files
    if not copy_frontend_files():
        sys.exit(1)
    
    print("\n🎉 Ready to start Railway simulation!")
    print("App will be available at: http://localhost:8080")
    print("Press Ctrl+C to stop\n")
    
    # Start app
    start_app()

if __name__ == '__main__':
    main()