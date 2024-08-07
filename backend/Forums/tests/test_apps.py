from django.apps import apps
from django.test import TestCase
from ..apps import ForumConfig


class ForumsConfigTest(TestCase):
    """
    Test cases for the Forums app configuration to ensure it is correctly set up.
    """

    def test_app_config(self):
        """
        Verify the name of the Forums app configuration.
        """
        self.assertEqual(ForumConfig.name, 'Forums')
        self.assertEqual(apps.get_app_config('Forums').name, 'Forums')
