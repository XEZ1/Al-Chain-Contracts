from django.test import SimpleTestCase
from django.core.wsgi import get_wsgi_application
from ASACBackEnd.wsgi import application as wsgi_application


class TestWSGI(SimpleTestCase):
    """
    Test suite for the WSGI application.
    Ensures that the WSGI application is correctly instantiated.
    """
    def test_wsgi_application(self):
        """
        Test to ensure the WSGI application is an instance of the correct class.
        """
        self.assertIsInstance(wsgi_application, get_wsgi_application().__class__)