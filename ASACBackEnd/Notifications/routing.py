from django.urls import path
from . import consumers  # Import your consumers here

websocket_urlpatterns = [
    path('ws/some_path/', consumers.YourConsumer.as_asgi()),  # Example route
]
