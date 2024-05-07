from django.apps import apps
from django.test import TestCase
from ..apps import ForumConfig


class ForumsConfigTest(TestCase):
    def test_app_config(self):
        self.assertEqual(ForumConfig.name, 'Forums')
        self.assertEqual(apps.get_app_config('Forums').name, 'Forums')
