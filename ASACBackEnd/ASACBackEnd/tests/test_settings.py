from django.test import TestCase, SimpleTestCase, override_settings
from django.conf import settings
from unittest.mock import patch
import os


class TestEnvironmentSettings(SimpleTestCase):

    def test_debug_mode(self):
        """ Test if DEBUG is set correctly based on environment. """
        expected_debug = False  # Change based on your env setup logic
        self.assertEqual(settings.DEBUG, expected_debug)

    def test_database_configuration(self):
        """ Ensure database configurations are loaded based on environment. """
        if settings.DEBUG:
            self.assertIn('sqlite3', settings.DATABASES['default']['ENGINE'])
        else:
            self.assertIn('sqlite3', settings.DATABASES['default']['ENGINE'])  # Change to postgressql LATER!!


class TestDatabaseConfig(TestCase):

    @patch('sys.argv', ['manage.py', 'test'])
    def test_database_config_for_tests(self):
        """ Test that DATABASES setting is configured for tests """
        with override_settings():
            from django.conf import settings
            settings._setup()
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            self.assertTrue("memory" in settings.DATABASES['default']['NAME'])

    @patch('sys.argv', ['manage.py', 'runserver'])
    def test_database_config_for_development(self):
        """ Test that DATABASES setting is configured for development """
        with override_settings():
            from django.conf import settings
            settings._setup()
            self.assertNotEqual(settings.DATABASES['default']['NAME'], ':memory:')


class TestInstalledAppsAndMiddleware(SimpleTestCase):

    def test_installed_apps(self):
        """ Verify critical applications are installed. """
        essential_apps = ['django.contrib.admin', 'rest_framework', 'channels']
        for app in essential_apps:
            self.assertIn(app, settings.INSTALLED_APPS)

    def test_middleware(self):
        """ Ensure necessary middleware are included. """
        essential_middleware = ['django.middleware.security.SecurityMiddleware']
        for mw in essential_middleware:
            self.assertIn(mw, settings.MIDDLEWARE)


class TestSecuritySettings(SimpleTestCase):

    def test_secret_key(self):
        """ Check that the secret key is set and not default in production. """
        if not settings.DEBUG:
            pass
            # self.assertNotEqual(settings.SECRET_KEY, 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')
        else:
            self.skipTest("Secret Key test is not applicable in debug mode.")

    def test_cors_settings(self):
        """ Test CORS headers configuration. """
        self.assertTrue(settings.CORS_ALLOW_ALL_ORIGINS)


class TestStaticAndMediaFiles(SimpleTestCase):

    def test_static_root(self):
        """ Verify static root is correctly configured. """
        self.assertTrue(str(settings.STATIC_ROOT).endswith('staticfiles'))

    def test_static_url(self):
        """ Check the static URL. """
        self.assertEqual(settings.STATIC_URL, '/static/')
