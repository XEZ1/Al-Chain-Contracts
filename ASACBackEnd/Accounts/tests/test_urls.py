from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    def test_push_token_url_resolves(self):
        url = reverse('push_token')
        self.assertEqual(resolve(url).func.view_class, AuthenticationPushTokenView)

    def test_validate_token_url_resolves(self):
        url = reverse('validate_token')
        self.assertEqual(resolve(url).func.view_class, ValidateAuthenticationTokenView)

    def test_sign_up_url_resolves(self):
        url = reverse('sign_up')
        self.assertEqual(resolve(url).func.view_class, SignUpView)

    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginView)