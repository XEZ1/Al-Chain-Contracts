from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from ..models import *
from ..serializers import *


class TestSignUpSerialiser(APITestCase):
    def test_valid_signup(self):
        data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'Complex@123',
            'password_confirmation': 'Complex@123'
        }
        response = self.client.post(reverse('sign_up'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_password_confirmation_mismatch(self):
        data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'Complex@123',
            'password_confirmation': 'Different@123'
        }
        response = self.client.post(reverse('sign_up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)

    def test_weak_password(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'weak',
            'password_confirmation': 'weak'
        }
        response = self.client.post(reverse('sign_up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_fields(self):
        data = {}
        response = self.client.post(reverse('sign_up'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestUserSerialiser(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_user_serialisation(self):
        data = UserSerialiser(self.user).data
        expected_keys = ['username', 'first_name', 'last_name', 'email']
        self.assertTrue(all(key in data for key in expected_keys))


class TestAuthenticationPushTokenSerialiser(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.client.force_authenticate(user=self.user)

    def test_token_creation(self):
        data = {'token': 'abc123'}
        response = self.client.post(reverse('push_token'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(AuthenticationPushToken.objects.filter(user=self.user).exists())
