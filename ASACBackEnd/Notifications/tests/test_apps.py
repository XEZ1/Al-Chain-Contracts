from django.apps import apps
from django.test import TestCase
from ..apps import NotificationsConfig


class NotificationsConfigTest(TestCase):
    def test_app_config(self):
        self.assertEqual(NotificationsConfig.name, 'Notifications')
        self.assertEqual(apps.get_app_config('Notifications').name, 'Notifications')
