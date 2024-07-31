from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import User, AuthenticationPushToken
from rest_framework.authtoken.models import Token
from Notifications.models import NotificationPushToken
from rest_framework.exceptions import AuthenticationFailed


# Base test suite for setting up common test data and client authentication
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


# Test suite for validating authentication tokens
class TestValidateAuthenticationTokenView(ViewTestCase):

    # Test that a valid token returns a 200 OK status and confirms the token is valid
    def test_validate_token_valid(self):
        response = self.client.get(reverse('validate-token'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'token_valid': True})

    # Test that an unauthenticated request returns a 401 Unauthorised status
    def test_validate_token_unauthenticated(self):
        self.client.logout()
        response = self.client.get(reverse('validate-token'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {'detail': 'Authentication credentials were not provided.'})

    # Test that an authentication failure raises an appropriate exception and returns a 401 Unauthorised status
    @patch('rest_framework.authentication.TokenAuthentication.authenticate')
    def test_validate_token_with_authentication_failure_exception(self, mock_auth):
        mock_auth.side_effect = AuthenticationFailed('Invalid token.')
        response = self.client.get(reverse('validate-token'))
        self.assertTrue(mock_auth.called, "The authenticate method was not called.")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {'token_valid': False})


# Test suite for the login view functionality
class TestLoginView(ViewTestCase):

    # Test that a successful login returns a 200 OK status and includes a token in the response
    def test_login_success(self):
        response = self.client.post(reverse('login'), {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

    # Test that a login attempt with incorrect credentials returns a 400 Bad Request status
    def test_login_failure(self):
        response = self.client.post(reverse('login'), {
            'username': self.user_data['username'],
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Wrong Credentials'})

    # Test that a successful login triggers a push notification
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


# Test suite for the sign-up view functionality
class TestSignUpView(ViewTestCase):

    # Test that a successful sign-up returns a 201 Created status
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

    # Test that a sign-up attempt with missing or incorrect fields returns a 400 Bad Request status
    def test_signup_failure(self):
        response = self.client.post(reverse('sign-up'), {
            'password': 'fakePassword123',
            'email': 'newuser@example'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# Test suite for the AuthenticationPushToken view functionality
class TestAuthenticationPushTokenView(ViewTestCase):

    # Test that retrieving an existing push token returns a 200 OK status
    def test_get_push_token_found(self):
        AuthenticationPushToken.objects.create(user=self.user, token='push_token_test')
        response = self.client.get(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['token'], 'push_token_test')

    # Test that retrieving a non-existent push token returns a 404 Not Found status
    def test_get_push_token_not_found(self):
        response = self.client.get(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Test that creating a new push token returns a 201 Created status and the correct token data
    def test_create_push_token_success(self):
        response = self.client.post(reverse('push-token'), {'token': 'push_token_test'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['token'], 'push_token_test')

    # Test that attempting to create a push token with missing data returns a 400 Bad Request status
    def test_create_push_token_failure(self):
        response = self.client.post(reverse('push-token'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test that deleting an existing push token returns a 204 No Content status
    def test_delete_push_token_found(self):
        AuthenticationPushToken.objects.create(user=self.user, token='push_token_test')
        response = self.client.delete(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # Test that attempting to delete a non-existent push token returns a 404 Not Found status
    def test_delete_push_token_not_found(self):
        response = self.client.delete(reverse('push-token'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
