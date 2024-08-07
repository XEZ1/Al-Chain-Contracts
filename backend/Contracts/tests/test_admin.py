from django.contrib import admin
from django.contrib.admin import ModelAdmin
from rest_framework import status
from ..models import SmartContract
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite

User = get_user_model()


class MockRequest:
    """
    A mock request object to simulate a user request.
    """
    def __init__(self):
        self.user = None


class SmartContractAdminTest(TestCase):
    """
    Test case for the SmartContract admin interface.
    Ensures that the SmartContract model is correctly registered and accessible in the admin interface.
    """
    def setUp(self):
        """
        Set up the test environment.

        This method creates a test user, sets the user as staff and superuser,
        and registers the SmartContract model with the admin site.
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

        self.site.register(SmartContract, ModelAdmin)

    def test_smart_contract_admin_registration(self):
        """
        Test that SmartContract is registered in the admin interface.

        This method checks if the SmartContract model is registered and uses the default ModelAdmin.
        """
        self.assertTrue(admin.site.is_registered(SmartContract), "SmartContract should be registered in the admin.")
        registered_admin = admin.site._registry[SmartContract]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "SmartContract should use ModelAdmin.")

    def test_smart_contract_admin_changelist_view(self):
        """
        Test the changelist view of the SmartContract model in the admin interface.

        This method simulates a request to the changelist page and checks if the response is successful.
        """
        request = self.factory.get('/admin/Contracts/smartcontract/')
        request.user = self.user

        admin_class = self.site._registry[SmartContract]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
