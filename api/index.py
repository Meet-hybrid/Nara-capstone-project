"""
Vercel serverless function entry point for Django application.
This file allows Vercel to properly route all requests to Django.
"""
import sys
import os

# Add project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the WSGI application
from config.wsgi import application

# Vercel expects the handler to be named "app"
app = application