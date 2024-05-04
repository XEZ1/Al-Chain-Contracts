import pytest
from django.test import TestCase, SimpleTestCase, override_settings
from .. import settings


class TestEnvironmentSettings(SimpleTestCase):


    def test_database_configuration(self):
        """ Ensure database configurations are loaded based on environment. """
        print(settings.DEBUG)
        if settings.DEBUG:
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            print(str(settings.DATABASES['default']['NAME']))
            self.assertTrue("memory" in str(settings.DATABASES['default']['NAME']))
        else:
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.postgresql')
            self.assertTrue("asacbackenddb" in str(settings.DATABASES['default']['NAME']))


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
        if settings.DEBUG:
            self.assertTrue(settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')
        else:
            self.assertFalse(settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')

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
