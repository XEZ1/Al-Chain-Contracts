from django.test import TestCase
from django.utils import timezone
from ..models import NotificationPushToken
from Accounts.models import User


class NotificationPushTokenModelTest(TestCase):

    @classmethod
    def setUpTestData(self):
        self.user = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.notification_token = NotificationPushToken.objects.create(
            user=self.user,
            token='ExponentPushToken[dummy_token]'
        )

    def test_token_fields(self):
        self.assertEqual(self.notification_token._meta.get_field('token').max_length, 255)
        self.assertTrue(self.notification_token._meta.get_field('token').unique)
        self.assertIsInstance(self.notification_token.user, User)
        self.assertIsInstance(self.notification_token.created_at, timezone.datetime)

    def test_token_string_representation(self):
        expected_string = f"{self.user.username} - {self.notification_token.token}"
        self.assertEqual(str(self.notification_token), expected_string)

    def test_token_auto_creation_timestamp(self):
        self.assertIsNotNone(self.notification_token.created_at)