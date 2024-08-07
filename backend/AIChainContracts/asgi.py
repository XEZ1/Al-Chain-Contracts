import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from Notifications.routing import websocket_urlpatterns


# Set the default settings module for the Django ASGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AIChainContracts.settings')

# Get the ASGI application for Django
django_asgi_app = get_asgi_application()

# Define the application protocol type router
application = ProtocolTypeRouter({
    # Route HTTP requests to the Django ASGI application
    "http": django_asgi_app,

    # Route WebSocket requests to the appropriate URL router with authentication middleware
    "websocket": AuthMiddlewareStack(
        URLRouter(
            # URL patterns for WebSocket connections
            websocket_urlpatterns
        )
    ),
})

