from django.test import SimpleTestCase
from channels.routing import ProtocolTypeRouter
from ASACBackEnd.asgi import application as asgi_application


class TestASGI(SimpleTestCase):
    def test_asgi_application(self):
        self.assertIsInstance(asgi_application, ProtocolTypeRouter)

        # Check if http and websocket keys exist in the application mapping
        self.assertIn('http', asgi_application.application_mapping)
        self.assertIn('websocket', asgi_application.application_mapping)