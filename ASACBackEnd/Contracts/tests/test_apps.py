from django.apps import apps
from django.test import TestCase
from ..apps import ContractsConfig


class ContractsConfigTest(TestCase):
    def test_app_config(self):
        self.assertEqual(ContractsConfig.name, 'Contracts')
        self.assertEqual(apps.get_app_config('Contracts').name, 'Contracts')
