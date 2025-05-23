from django.contrib import admin
from django.contrib.admin import ModelAdmin
from rest_framework import status
from ..models import NotificationPushToken
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite

User = get_user_model()


class MockRequest:
    """
    Mock request class for testing purposes.
    """
    def __init__(self):
        self.user = None


class NotificationPushTokenAdminTest(TestCase):
    """
    Test case for the NotificationPushToken admin interface.
    """
    def setUp(self):
        """
        Set up initial data for the tests, including creating a user and registering the model in the admin.
        """
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

        self.site.register(NotificationPushToken, ModelAdmin)

    def test_notification_push_token_admin_registration(self):
        """
        Test that the NotificationPushToken model is registered in the admin interface and uses ModelAdmin.
        """
        self.assertTrue(admin.site.is_registered(NotificationPushToken), "NotificationPushToken should be registered in the admin.")
        registered_admin = admin.site._registry[NotificationPushToken]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "NotificationPushToken should use ModelAdmin.")

    def test_notification_push_token_admin_changelist_view(self):
        """
        Test that the change list view of the NotificationPushToken admin works correctly.
        """
        request = self.factory.get('/admin/Notifications/notificationpushtoken/')
        request.user = self.user

        admin_class = self.site._registry[NotificationPushToken]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
