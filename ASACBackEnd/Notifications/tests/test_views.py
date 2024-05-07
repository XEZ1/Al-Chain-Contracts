from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from Accounts.models import User
from ..models import NotificationPushToken
from rest_framework.authtoken.models import Token


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
        self.save_token_url = reverse('save-token')
        self.delete_token_url = reverse('delete-token')


class TestSaveTokenView(ViewTestCase):
    def test_save_token(self):
        response = self.client.post(self.save_token_url, {'token': 'dummy_token'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NotificationPushToken.objects.count(), 1)

    def test_save_token_missing_token(self):
        response = self.client.post(self.save_token_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(NotificationPushToken.objects.count(), 0)


class TestDeleteTokenView(ViewTestCase):
    def test_delete_token(self):

        NotificationPushToken.objects.create(user=self.user, token='dummy_token')
        response = self.client.post(self.delete_token_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(NotificationPushToken.objects.filter(user=self.user).exists())
