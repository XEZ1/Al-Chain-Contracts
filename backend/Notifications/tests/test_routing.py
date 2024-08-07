import pytest
from channels.testing import WebsocketCommunicator
from AIChainContracts.asgi import application

@pytest.mark.django_db
@pytest.mark.asyncio
class TestWebSocketRouting:
    async def test_notification_route(self):
        """
        Test the WebSocket connection at /ws/notifications/ is correctly routed to NotificationConsumer.
        """
        # Create a WebsocketCommunicator instance to test the connection.
        communicator = WebsocketCommunicator(application, 'ws/notifications/')
        # Attempt to connect to the WebSocket path.
        connected, subprotocol = await communicator.connect()
        # Assert that the WebSocket connection was successful.
        assert connected, "WebSocket connection failed, check routing and consumer."
        # Clean up by disconnecting.
        await communicator.disconnect()
