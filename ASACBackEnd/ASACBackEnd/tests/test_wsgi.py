from django.test import SimpleTestCase
from django.core.wsgi import get_wsgi_application
from ASACBackEnd.wsgi import application as wsgi_application


class TestWSGI(SimpleTestCase):
    def test_wsgi_application(self):
        self.assertIsInstance(wsgi_application, get_wsgi_application().__class__)