from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


# Test suite for URL resolution
class TestUrls(SimpleTestCase):
    # Test that the URL for 'push-token' correctly resolves to the AuthenticationPushTokenView view
    def test_push_token_url_resolves(self):
        url = reverse('push-token')
        self.assertEqual(resolve(url).func.view_class, AuthenticationPushTokenView)

    # Test that the URL for 'validate-token' correctly resolves to the ValidateAuthenticationTokenView view
    def test_validate_token_url_resolves(self):
        url = reverse('validate-token')
        self.assertEqual(resolve(url).func.view_class, ValidateAuthenticationTokenView)

    # Test that the URL for 'sign-up' correctly resolves to the SignUpView view
    def test_sign_up_url_resolves(self):
        url = reverse('sign-up')
        self.assertEqual(resolve(url).func.view_class, SignUpView)

    # Test that the URL for 'login' correctly resolves to the LoginView view
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginView)