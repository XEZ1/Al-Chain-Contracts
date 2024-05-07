from django.test import SimpleTestCase
from .. import settings
from ..settings import get_database_config
from unittest import mock
import importlib


class TestEnvironmentSettings(SimpleTestCase):

    def test_database_configuration(self):
        """ Ensure database configurations are loaded based on environment. """
        if settings.DEBUG:
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            self.assertTrue("memory" in str(settings.DATABASES['default']['NAME']))
        else:
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.postgresql')
            self.assertTrue("asacbackenddb" in str(settings.DATABASES['default']['NAME']))

    def test_database_config(self):
        sqlite_config = get_database_config(True)
        assert sqlite_config['default']['ENGINE'] == 'django.db.backends.sqlite3'

        postgres_config = get_database_config(False)
        assert postgres_config['default']['ENGINE'] == 'django.db.backends.postgresql'

    @mock.patch('sys.argv', ['manage.py', 'test'])
    def test_database_settings_for_test(self):
        """Ensure DATABASES is set to use in-memory SQLite during tests."""
        with mock.patch('sys.argv', ['manage.py', 'test']):
            importlib.reload(settings)
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            self.assertTrue("memory" in settings.DATABASES['default']['NAME'])

        importlib.reload(settings)

    @mock.patch('sys.argv', ['manage.py', 'runserver'])
    def test_database_config_for_normal_operation(self):
        """ Test database configuration under normal operation (not testing). """
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
        if settings.DEBUG:
            self.assertTrue(settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')
        else:
            self.assertFalse(
                settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')

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
