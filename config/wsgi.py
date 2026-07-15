import os
from django.core.wsgi import get_wsgi_application

# Vercel automatically sets DJANGO_SETTINGS_MODULE from vercel.json
# Use the default from environment, fallback to vercel settings
settings_module = os.environ.get(
    "DJANGO_SETTINGS_MODULE", 
    "config.settings.vercel"
)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
application = get_wsgi_application()
