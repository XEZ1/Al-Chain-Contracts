from django.contrib import admin
from ..models import SmartContract
from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite

User = get_user_model()


class MockRequest:
    def __init__(self):
        self.user = None


class SmartContractAdminTest(TestCase):
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

    def test_smart_contract_admin_registration(self):
        # Check if SmartContract is registered in the admin and uses the default ModelAdmin
        self.assertTrue(admin.site.is_registered(SmartContract), "SmartContract should be registered in the admin.")
        registered_admin = admin.site._registry[SmartContract]
        self.assertIsInstance(registered_admin, admin.ModelAdmin, "SmartContract should use ModelAdmin.")

    def test_admin_changelist_view(self):
        # Simulate a request to the admin interface to test the changelist page
        request = self.factory.get('/admin/contracts/smartcontract/')
        request.user = self.user

        admin_class = self.site._registry[SmartContract]

        response = admin_class.changelist_view(request)
        self.assertEqual(response.status_code, 200)
