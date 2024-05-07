from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    def test_save_token_url_resolves(self):
        url = reverse('save-token')
        self.assertEqual(resolve(url).func.view_class, SaveTokenView)

    def test_delete_token_url_resolves(self):
        url = reverse('delete-token')
        self.assertEqual(resolve(url).func.view_class, DeleteTokenView)