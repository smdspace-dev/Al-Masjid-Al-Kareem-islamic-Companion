#!/usr/bin/env python3
"""
Railway Deployment Test Script
Checks if the app is ready for Railway deployment
"""

import os
import sys
import json

def check_file_exists(filepath, description):
    """Check if a required file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - MISSING")
        return False

def check_requirements():
    """Check if requirements.txt has necessary packages"""
    try:
        with open('requirements.txt', 'r') as f:
            content = f.read()
            required_packages = ['Flask', 'gunicorn', 'psycopg2-binary']
            missing = []
            
            for package in required_packages:
                if package.lower() not in content.lower():
                    missing.append(package)
            
            if missing:
                print(f"❌ Missing packages in requirements.txt: {', '.join(missing)}")
                return False
            else:
                print(f"✅ All required packages found in requirements.txt")
                return True
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def check_frontend_build():
    """Check if frontend has build script"""
    try:
        with open('frontend/package.json', 'r') as f:
            package_data = json.load(f)
            if 'build' in package_data.get('scripts', {}):
                print("✅ Frontend build script found")
                return True
            else:
                print("❌ Frontend build script missing")
                return False
    except FileNotFoundError:
        print("❌ frontend/package.json not found")
        return False

def main():
    """Main deployment readiness check"""
    print("🚂 Railway Deployment Readiness Check")
    print("=" * 40)
    
    all_good = True
    
    # Check required files
    files_to_check = [
        ('requirements.txt', 'Python requirements'),
        ('Procfile', 'Railway Procfile'),
        ('nixpacks.toml', 'Railway build config'),
        ('backend/app.py', 'Flask application'),
        ('frontend/package.json', 'Frontend package.json'),
        ('backend/config.py', 'Flask configuration')
    ]
    
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            all_good = False
    
    # Check requirements content
    if not check_requirements():
        all_good = False
    
    # Check frontend build
    if not check_frontend_build():
        all_good = False
    
    print("\n" + "=" * 40)
    if all_good:
        print("🎉 Your app is ready for Railway deployment!")
        print("📝 Next steps:")
        print("   1. Commit all changes to Git")
        print("   2. Push to GitHub")
        print("   3. Deploy to Railway")
        print("   4. Add environment variables")
        print("   5. Add PostgreSQL service")
    else:
        print("❌ Please fix the issues above before deploying")
        sys.exit(1)

if __name__ == '__main__':
    main()