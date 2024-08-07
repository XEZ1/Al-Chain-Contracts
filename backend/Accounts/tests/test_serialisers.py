from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from ..models import *
from ..serialisers import *


# Test case for the SignUpSerialiser
class TestSignUpSerialiser(APITestCase):
    # Test that a valid sign-up request creates a new user and returns HTTP 201 Created
    def test_valid_signup(self):
        data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'Complex@123',
            'password_confirmation': 'Complex@123'
        }
        response = self.client.post(reverse('sign-up'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Test that a sign-up request with mismatched password and password_confirmation returns HTTP 400 Bad Request
    def test_password_confirmation_mismatch(self):
        data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'Complex@123',
            'password_confirmation': 'Different@123'
        }
        response = self.client.post(reverse('sign-up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)

    # Test that a sign-up request with a weak password returns HTTP 400 Bad Request
    def test_weak_password(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'weak',
            'password_confirmation': 'weak'
        }
        response = self.client.post(reverse('sign-up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test that a sign-up request with missing required fields returns HTTP 400 Bad Request
    def test_missing_fields(self):
        data = {}
        response = self.client.post(reverse('sign-up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# Test suite for the UserSerialiser
class TestUserSerialiser(APITestCase):
    # Set up a test user for use in the test methods
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    # Test that the UserSerialiser serialises the user model correctly, including the expected fields
    def test_user_serialisation(self):
        data = UserSerialiser(self.user).data
        expected_keys = ['username', 'first_name', 'last_name', 'email']
        self.assertTrue(all(key in data for key in expected_keys))


# Test suite for the AuthenticationPushTokenSerialiser
class TestAuthenticationPushTokenSerialiser(APITestCase):

    # Set up a test user and authenticate them for use in the test methods
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.client.force_authenticate(user=self.user)

    # Test that a valid token creation request returns HTTP 201 Created and the token is saved in the database
    def test_token_creation(self):
        data = {'token': 'abc123'}
        response = self.client.post(reverse('push-token'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AuthenticationPushToken.objects.filter(user=self.user).exists())
