from django.apps import apps
from django.test import TestCase
from ..apps import NotificationsConfig


class NotificationsConfigTest(TestCase):
    """
    Test case to verify the configuration of the Notifications app.
    """

    def test_app_config(self):
        """
        Test that the NotificationsConfig is correctly set up.
        """
        self.assertEqual(NotificationsConfig.name, 'Notifications')
        self.assertEqual(apps.get_app_config('Notifications').name, 'Notifications')
