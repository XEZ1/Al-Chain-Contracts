from django.contrib import admin
from django.contrib.admin import ModelAdmin
from rest_framework import status
from ..models import Post, Comment, Like
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite

User = get_user_model()


class MockRequest:
    """
    A mock request class to simulate admin interface requests.
    """
    def __init__(self):
        self.user = None


class PostAdminTest(TestCase):
    """
    Test cases for the Post admin interface to ensure it is correctly set up.
    """
    def setUp(self):
        """
        Set up test data including a user with admin permissions.
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

        self.site.register(Post, ModelAdmin)

    def test_post_admin_registration(self):
        """
        Verify that the Post model is registered with the admin interface using ModelAdmin.
        """
        self.assertTrue(admin.site.is_registered(Post), "Post should be registered in the admin.")
        registered_admin = admin.site._registry[Post]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "Post should use ModelAdmin.")

    def test_post_admin_changelist_view(self):
        """
        Simulate a request to the admin interface to test the changelist view for the Post model.
        """
        request = self.factory.get('/admin/Forums/post/')
        request.user = self.user

        admin_class = self.site._registry[Post]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CommentTokenAdminTest(TestCase):
    """
    Test cases for the Comment admin interface to ensure it is correctly set up.
    """
    def setUp(self):
        """
        Set up test data including a user with admin permissions.
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

        self.site.register(Comment, ModelAdmin)

    def test_comment_admin_registration(self):
        """
        Verify that the Comment model is registered with the admin interface using ModelAdmin.
        """
        self.assertTrue(admin.site.is_registered(Comment), "Comment should be registered in the admin.")
        registered_admin = admin.site._registry[Comment]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "Comment should use ModelAdmin.")

    def test_comment_admin_changelist_view(self):
        """
        Simulate a request to the admin interface to test the changelist view for the Comment model.
        """
        request = self.factory.get('/admin/Forums/comment/')
        request.user = self.user

        admin_class = self.site._registry[Comment]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LikeAdminTest(TestCase):
    """
    Test cases for the Like admin interface to ensure it is correctly set up.
    """

    def setUp(self):
        """
        Set up test data including a user with admin permissions.
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

        self.site.register(Like, ModelAdmin)

    def test_like_admin_registration(self):
        """
        Verify that the Like model is registered with the admin interface using ModelAdmin.
        """
        self.assertTrue(admin.site.is_registered(Like), "Like should be registered in the admin.")
        registered_admin = admin.site._registry[Like]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "Like should use ModelAdmin.")

    def test_like_admin_changelist_view(self):
        """
        Simulate a request to the admin interface to test the changelist view for the Like model.
        """
        request = self.factory.get('/admin/Forums/like/')
        request.user = self.user

        admin_class = self.site._registry[Like]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
