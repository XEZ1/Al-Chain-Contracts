from django.apps import apps
from django.test import TestCase
from Contracts.apps import ContractsConfig


class ContractsConfigTest(TestCase):
    def test_app_config(self):
        self.assertEqual(ContractsConfig.name, 'Accounts')
        self.assertEqual(apps.get_app_config('Accounts').name, 'Accounts')
