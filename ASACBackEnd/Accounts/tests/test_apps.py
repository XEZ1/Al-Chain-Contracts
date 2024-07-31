from django.apps import apps
from django.test import TestCase
from ..apps import AccountsConfig


# Define a test suite for the Accounts application configuration
class AccountsConfigTest(TestCase):
    def test_app_config(self):
        # Test that the name attribute of AccountsConfig is set correctly
        self.assertEqual(AccountsConfig.name, 'Accounts')
        # Test that the app configuration for 'Accounts' is retrieved correctly
        self.assertEqual(apps.get_app_config('Accounts').name, 'Accounts')
