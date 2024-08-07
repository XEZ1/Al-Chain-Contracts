from django.test import TestCase
from django.utils import timezone
from ..models import NotificationPushToken
from Accounts.models import User


class NotificationPushTokenModelTest(TestCase):
    """
    Test case for the NotificationPushToken model to ensure it handles tokens correctly.
    """

    @classmethod
    def setUpTestData(self):
        """
        Set up initial data for the tests, including creating a user and a notification token.
        """
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
        """
        Test the attributes of the NotificationPushToken fields, ensuring correct types and constraints.
        """
        self.assertEqual(self.notification_token._meta.get_field('token').max_length, 255)
        self.assertTrue(self.notification_token._meta.get_field('token').unique)
        self.assertIsInstance(self.notification_token.user, User)
        self.assertIsInstance(self.notification_token.created_at, timezone.datetime)

    def test_token_string_representation(self):
        """
        Test the string representation of the NotificationPushToken.
        """
        expected_string = f"{self.user.username} - {self.notification_token.token}"
        self.assertEqual(str(self.notification_token), expected_string)

    def test_token_auto_creation_timestamp(self):
        """
        Test that the created_at timestamp is automatically set upon creation.
        """
        self.assertIsNotNone(self.notification_token.created_at)