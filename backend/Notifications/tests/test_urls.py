from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    """
    Test case for URL resolution.
    """
    def test_save_token_url_resolves(self):
        """
        Test if the save-token URL resolves to SaveTokenView.
        """
        url = reverse('save-token')
        self.assertEqual(resolve(url).func.view_class, SaveTokenView)

    def test_delete_token_url_resolves(self):
        """
        Test if the delete-token URL resolves to DeleteTokenView.
        """
        url = reverse('delete-token')
        self.assertEqual(resolve(url).func.view_class, DeleteTokenView)