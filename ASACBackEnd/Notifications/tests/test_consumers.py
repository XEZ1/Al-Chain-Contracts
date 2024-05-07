import pytest
import json
import asyncio
from channels.testing import WebsocketCommunicator
from ASACBackEnd.asgi import application
from channels.layers import get_channel_layer

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestNotificationConsumer:

    async def test_consumer_connects_to_group(self):
        communicator = WebsocketCommunicator(application, "/ws/notifications/")
        connected, subprotocol = await communicator.connect()
        assert connected

        # Send a message to the group and see if the communicator receives it.
        channel_layer = get_channel_layer()
        group_name = 'notification_group'
        await channel_layer.group_send(group_name, {
            "type": "notification.message",
            "text": "Hello group!",
        })

        # Receive the message from the communicator
        try:
            response = await communicator.receive_json_from()
            assert response['text'] == "Hello group!"
        finally:
            await communicator.disconnect()

    async def test_consumer_disconnects_properly(self):
        communicator = WebsocketCommunicator(application, "/ws/notifications/")
        await communicator.connect()
        await communicator.disconnect()

        # After disconnect, ensure no messages are received
        channel_layer = get_channel_layer()
        group_name = 'notification_group'
        await channel_layer.group_send(group_name, {
            "type": "notification.message",
            "text": "Hello group after disconnect!",
        })

        # Try receiving with a timeout, expecting None or handling timeout
        try:
            response = await communicator.receive_json_from(timeout=1)
            assert response is None
        except asyncio.TimeoutError:
            assert True  # Expected timeout, pass the test

    async def test_consumer_receives_and_sends_message(self):
        communicator = WebsocketCommunicator(application, "/ws/notifications/")
        await communicator.connect()

        # Send a message to the server
        await communicator.send_to(text_data=json.dumps({"message": "hello"}))
        # Receive response from the server
        response = await communicator.receive_json_from()
        assert response['message'] == "hello"

        await communicator.disconnect()

