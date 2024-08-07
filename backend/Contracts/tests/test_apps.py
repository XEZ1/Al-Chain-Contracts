from django.apps import apps
from django.test import TestCase
from ..apps import ContractsConfig


class ContractsConfigTest(TestCase):
    """
    Test case for the Contracts application configuration.
    Ensures that the Contracts application is correctly configured.
    """
    def test_app_config(self):
        """
        Test that the Contracts application configuration is correct.

        This method checks that the name of the ContractsConfig class and the registered app name are correct.
        """
        self.assertEqual(ContractsConfig.name, 'Contracts')
        self.assertEqual(apps.get_app_config('Contracts').name, 'Contracts')
