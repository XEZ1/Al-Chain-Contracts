from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import User, AuthenticationPushToken
from rest_framework.authtoken.models import Token
from Notifications.models import NotificationPushToken
from rest_framework.exceptions import AuthenticationFailed


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'first_name': 'test',
            'last_name': 'user',
            'email': 'testuser@kcl.ac.uk',
            'password': '123456789A!'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class TestValidateAuthenticationTokenView(ViewTestCase):
    def test_validate_token_valid(self):
        response = self.client.get(reverse('validate-token'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'token_valid': True})

    def test_validate_token_unauthenticated(self):
        self.client.logout()
        response = self.client.get(reverse('validate-token'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {'detail': 'Authentication credentials were not provided.'})

    @patch('rest_framework.authentication.TokenAuthentication.authenticate')
    def test_validate_token_with_authentication_failure_exception(self, mock_auth):
        mock_auth.side_effect = AuthenticationFailed('Invalid token.')
        response = self.client.get(reverse('validate-token'))
        self.assertTrue(mock_auth.called, "The authenticate method was not called.")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {'token_valid': False})


class TestLoginView(ViewTestCase):
    def test_login_success(self):
        response = self.client.post(reverse('login'), {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

    def test_login_failure(self):
        response = self.client.post(reverse('login'), {
            'username': self.user_data['username'],
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Wrong Credentials'})

    @patch('Accounts.views.send_push_notification')
    def test_login_success_with_notification(self, mock_send):
        NotificationPushToken.objects.create(user=self.user, token='dummy_token')
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('login'), {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send.assert_called_once_with('dummy_token', "Welcome Back!", "You've successfully logged in.")


class TestSignUpView(ViewTestCase):
    def test_signup_success(self):
        response = self.client.post(reverse('sign-up'), {
            'username': 'newuser',
            'password': 'newpassWORD123!',
            'password_confirmation': 'newpassWORD123!',
            'first_name': 'new',
            'last_name': 'user',
            'email': 'newuser@example.com'
        })
        print(response.json())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_signup_failure(self):
        response = self.client.post(reverse('sign-up'), {
            'password': 'fakePassword123',
            'email': 'newuser@example'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestAuthenticationPushTokenView(ViewTestCase):

    def test_get_push_token_found(self):
        AuthenticationPushToken.objects.create(user=self.user, token='push_token_test')
        response = self.client.get(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['token'], 'push_token_test')

    def test_get_push_token_not_found(self):
        response = self.client.get(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_push_token_success(self):
        response = self.client.post(reverse('push-token'), {'token': 'push_token_test'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['token'], 'push_token_test')

    def test_create_push_token_failure(self):
        response = self.client.post(reverse('push-token'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_push_token_found(self):
        AuthenticationPushToken.objects.create(user=self.user, token='push_token_test')
        response = self.client.delete(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_push_token_not_found(self):
        response = self.client.delete(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
