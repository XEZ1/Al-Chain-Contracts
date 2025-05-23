from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from ..models import *
from ..serialisers import *


class TestNotificationPushTokenSerialiser(APITestCase):
    """
    Test case for NotificationPushTokenSerialiser.
    """
    def setUp(self):
        """
        Set up a test user and authenticate the client.
        """
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.client.force_authenticate(user=self.user)

    def test_token_creation(self):
        """
        Test creating a notification push token.
        """
        data = {'token': 'abc123'}
        response = self.client.post(reverse('save-token'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
        self.assertTrue(NotificationPushToken.objects.filter(user=self.user).exists())

