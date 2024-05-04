from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from ..models import User, AuthenticationPushToken
import pytest


class UserModelTest(TestCase):

    @classmethod
    def setUpTestData(self):
        self.user = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )

    def test_user_field_attributes(self):
        self.assertEqual(self.user._meta.get_field('username').max_length, 15)
        self.assertEqual(self.user._meta.get_field('first_name').max_length, 15)
        self.assertEqual(self.user._meta.get_field('last_name').max_length, 15)
        self.assertEqual(self.user._meta.get_field('email').max_length, 35)
        self.assertTrue(self.user._meta.get_field('username').unique)
        self.assertTrue(self.user._meta.get_field('email').unique)
        self.assertFalse(self.user._meta.get_field('username').blank)
        self.assertFalse(self.user._meta.get_field('first_name').blank)
        self.assertFalse(self.user._meta.get_field('last_name').blank)
        self.assertFalse(self.user._meta.get_field('email').blank)

    def test_user_username_validator(self):
        with self.assertRaises(ValidationError):
            user = User(username='ab', first_name='Jane', last_name='Doe', email='janedoe@example.com')
            user.full_clean()

    def test_paying_user_default(self):
        self.assertFalse(self.user.paying_user)

    def test_user_unique_email(self):
        with self.assertRaises(IntegrityError):
            User.objects.create(username='uniqueuser456', first_name='Alice', last_name='Smith',
                                email='testuser@kcl.ac.uk')

    def test_user_string_representation(self):
        self.assertEqual(str(self.user), self.user.username)


class AuthenticationPushTokenModelTest(TestCase):

    @classmethod
    def setUpTestData(self):
        self.user = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.auth_token = AuthenticationPushToken.objects.create(
            user=self.user,
            token='ExponentPushToken[dummy_token]'
        )

    def test_token_fields(self):
        self.assertEqual(self.auth_token._meta.get_field('token').max_length, 200)
        self.assertTrue(self.auth_token._meta.get_field('token').unique)

    def test_related_name(self):
        self.assertEqual(self.user.authorisation_tokens, self.auth_token)

    def test_token_string_representation(self):
        expected_string = f"{self.user.username} - {self.auth_token.token}"
        self.assertEqual(str(self.auth_token), expected_string)

    def test_token_auto_creation_timestamp(self):
        self.assertIsNotNone(self.auth_token.created_at)
