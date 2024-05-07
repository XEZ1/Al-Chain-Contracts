# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'notification_group'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            await self.send(text_data=json.dumps({'message': message}))
            await self.channel_layer.group_send(self.group_name, {
                'type': 'notification.message',
                'text': message
            })

    async def notification_message(self, event):
        await self.send(text_data=json.dumps({'text': event['text']}))