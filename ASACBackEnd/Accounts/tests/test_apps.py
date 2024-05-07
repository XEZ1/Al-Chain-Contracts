from django.apps import apps
from django.test import TestCase
from ..apps import AccountsConfig


class AccountsConfigTest(TestCase):
    def test_app_config(self):
        self.assertEqual(AccountsConfig.name, 'Accounts')
        self.assertEqual(apps.get_app_config('Accounts').name, 'Accounts')
