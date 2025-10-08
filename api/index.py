# Vercel Serverless Entry Point for Muslim Companion Backend
import os
import sys

# Add current directory to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import the Flask app
from app import app

# This is required for Vercel to detect the app
# The variable name must be 'app' for Vercel Python runtime