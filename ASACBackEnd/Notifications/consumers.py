# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer to handle real-time notifications.
    Manages connections, disconnections, and message handling for notifications.
    """

    async def connect(self):
        """
        Handle a new WebSocket connection.
        Add the connecting client to the notification group and accept the connection.
        """
        self.group_name = 'notification_group'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        Remove the disconnecting client from the notification group.

        @param close_code: The close code for the disconnection.
        """
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        """
        Handle incoming messages from the WebSocket.
        Broadcast the received message to the notification group.

        @param text_data: The text data received from the client.
        @param bytes_data: The bytes data received from the client (not used here).
        """
        if text_data:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            await self.send(text_data=json.dumps({'message': message}))
            await self.channel_layer.group_send(self.group_name, {
                'type': 'notification.message',
                'text': message
            })

    async def notification_message(self, event):
        """
        Handle messages sent to the notification group.
        Send the message to the WebSocket client.

        @param event: The event data containing the message text.
        """
        await self.send(text_data=json.dumps({'text': event['text']}))