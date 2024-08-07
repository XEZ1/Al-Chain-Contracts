from django.test import SimpleTestCase
from .. import settings
from ..settings import get_database_config
from unittest import mock
import importlib


class TestEnvironmentSettings(SimpleTestCase):
    """
    Test suite for environment-specific settings.
    Ensures that the settings are configured correctly based on the environment.
    """

    def test_database_configuration(self):
        """
        Ensure database configurations are loaded based on the environment.

        Checks if the correct database engine and name are used depending on
        whether the application is in DEBUG mode or not.
        """
        if settings.DEBUG:
            # In DEBUG mode, ensure the database engine is SQLite and uses an in-memory database
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            self.assertTrue("memory" in str(settings.DATABASES['default']['NAME']))
        else:
            # In production, ensure the database engine is PostgreSQL and uses the specified database name
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.postgresql')
            self.assertTrue("aiccdb" in str(settings.DATABASES['default']['NAME']))

    def test_database_config(self):
        """
        Test the database configuration function to ensure it returns the correct settings
        based on the provided debug flag.
        """
        # Ensure the function returns SQLite settings when debug is True
        sqlite_config = get_database_config(True)
        assert sqlite_config['default']['ENGINE'] == 'django.db.backends.sqlite3'

        # Ensure the function returns PostgreSQL settings when debug is False
        postgres_config = get_database_config(False)
        assert postgres_config['default']['ENGINE'] == 'django.db.backends.postgresql'

    @mock.patch('sys.argv', ['manage.py', 'test'])
    def test_database_settings_for_test(self):
        """
        Ensure DATABASES is set to use in-memory SQLite during tests.

        This verifies that when running tests, the database settings are correctly
        configured to use an in-memory SQLite database.
        """
        with mock.patch('sys.argv', ['manage.py', 'test']):
            importlib.reload(settings)
            self.assertEqual(settings.DATABASES['default']['ENGINE'], 'django.db.backends.sqlite3')
            self.assertTrue("memory" in settings.DATABASES['default']['NAME'])

        # Reload settings to reset any changes made during the test
        importlib.reload(settings)

    @mock.patch('sys.argv', ['manage.py', 'runserver'])
    def test_database_config_for_normal_operation(self):
        """
        Test database configuration under normal operation (not testing).

        This ensures that the database settings are not using an in-memory SQLite
        database when the application is running normally.
        """
        self.assertNotEqual(settings.DATABASES['default']['NAME'], ':memory:')


class TestInstalledAppsAndMiddleware(SimpleTestCase):
    """
    Test suite for installed applications and middleware.
    Ensures that critical applications and middleware are included in the settings.
    """

    def test_installed_apps(self):
        """
        Verify critical applications are installed.

        This checks that essential applications such as the admin interface,
        Django REST framework, and Channels are included in the installed apps.
        """
        essential_apps = ['django.contrib.admin', 'rest_framework', 'channels']
        for app in essential_apps:
            self.assertIn(app, settings.INSTALLED_APPS)

    def test_middleware(self):
        """
        Ensure necessary middleware are included.

        This checks that essential middleware, such as the security middleware,
        are included in the middleware settings.
        """

        essential_middleware = ['django.middleware.security.SecurityMiddleware']
        for mw in essential_middleware:
            self.assertIn(mw, settings.MIDDLEWARE)


class TestSecuritySettings(SimpleTestCase):
    """
    Test case for security-related settings.
    Ensures that the secret key and CORS settings are correctly configured.
    """

    def test_secret_key(self):
        """
        Check that the secret key is set and not the default in production.

        This ensures that in production, the secret key is not using the default
        insecure key.
        """
        if settings.DEBUG:
            self.assertTrue(settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')
        else:
            self.assertFalse(
                settings.SECRET_KEY == 'django-insecure-sd*6c$qhzhfw7k#ncii@3nnzxco@k&+n%fq0_=ze5hg7+j9k(z')

    def test_cors_settings(self):
        """
        Test CORS headers configuration.

        This checks that the CORS settings allow the specified origins.
        """
        expected_origins = [
            'http://localhost:8000',
            'https://www.alsalibiaicontracts.co.uk',
            'https://alsalibiaicontracts.co.uk',
        ]
        self.assertEqual(settings.CORS_ALLOWED_ORIGINS, expected_origins)


class TestStaticAndMediaFiles(SimpleTestCase):
    """
    Test case for static and media files settings.
    Ensures that the static files settings are correctly configured.
    """

    def test_static_root(self):
        """
        Verify static root is correctly configured.

        This checks that the STATIC_ROOT setting ends with 'staticfiles',
        indicating the correct directory for static files.
        """
        self.assertTrue(str(settings.STATIC_ROOT).endswith('staticfiles'))

    def test_static_url(self):
        """
        Check the static URL.

        This ensures that the STATIC_URL setting is set to '/static/',
        indicating the URL prefix for serving static files.
        """
        self.assertEqual(settings.STATIC_URL, '/static/')
