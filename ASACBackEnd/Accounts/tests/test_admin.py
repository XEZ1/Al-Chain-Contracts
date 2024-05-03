from django.contrib import admin
from django.contrib.admin import ModelAdmin
from rest_framework import status
from ..models import User, AuthenticationPushToken
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite

User = get_user_model()


class MockRequest:
    def __init__(self):
        self.user = None


class UserAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.factory = RequestFactory()

        self.user = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.user.is_staff = True
        self.user.is_superuser = True
        self.user.save()

        self.site.register(User, ModelAdmin)

    def test_user_admin_registration(self):
        self.assertTrue(admin.site.is_registered(User), "User should be registered in the admin.")
        registered_admin = admin.site._registry[User]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "User should use ModelAdmin.")

    def test_admin_changelist_view(self):
        request = self.factory.get('/admin/Accounts/user/')
        request.user = self.user

        admin_class = self.site._registry[User]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AuthenticationPushTokenAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.factory = RequestFactory()

        self.user = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.user.is_staff = True
        self.user.is_superuser = True
        self.user.save()

        self.site.register(AuthenticationPushToken, ModelAdmin)

    def test_user_admin_registration(self):
        self.assertTrue(admin.site.is_registered(AuthenticationPushToken), "Authentication Push Token should be registered in the admin.")
        registered_admin = admin.site._registry[AuthenticationPushToken]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "Authentication Push Token should use ModelAdmin.")

    def test_admin_changelist_view(self):
        request = self.factory.get('/admin/Accounts/authenticationpushtoken/')
        request.user = self.user

        admin_class = self.site._registry[AuthenticationPushToken]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
