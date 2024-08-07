"""
WSGI config for ASACBackEnd project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""
import os
from django.core.wsgi import get_wsgi_application


# Set the default Django settings module for the 'ASACBackEnd' project
# This tells Django which settings file to use for the project configuration
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ASACBackEnd.settings')

# Get the WSGI application for the project
# This callable serves as the entry point for WSGI-compatible web servers to serve your project
application = get_wsgi_application()
