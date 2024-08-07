from django.urls import path
from . import consumers


# Define URL patterns for WebSocket connections in the notifications application
websocket_urlpatterns = [
    path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
]
