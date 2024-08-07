from django.test import SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.admin.sites import AdminSite
from Accounts.views import *
from Notifications.views import *
from Contracts.views import *
from Forums.views import *


class TestUrls(SimpleTestCase):
    """
    Test suite for URL resolutions.
    Ensures that each URL correctly resolves to its intended view.
    """

    def test_admin_url_resolves(self):
        """
        Test that the admin URL resolves to the admin index view.
        """
        url = reverse('admin:index')
        resolved = resolve(url)
        # Ensure that the resolved function's name and class match the expected admin index view
        self.assertEqual(resolved.func.__name__, AdminSite.index.__name__)
        self.assertEqual(resolved.func.__class__, AdminSite.index.__class__)

    def test_push_token_url_resolves(self):
        """
        Test that the push token URL resolves to the AuthenticationPushTokenView.
        """
        url = reverse('push-token')
        # Ensure that the resolved view class is AuthenticationPushTokenView
        self.assertEqual(resolve(url).func.view_class, AuthenticationPushTokenView)

    def test_validate_token_url_resolves(self):
        """
        Test that the validate token URL resolves to the ValidateAuthenticationTokenView.
        """
        url = reverse('validate-token')
        # Ensure that the resolved view class is ValidateAuthenticationTokenView
        self.assertEqual(resolve(url).func.view_class, ValidateAuthenticationTokenView)

    def test_sign_up_url_resolves(self):
        """
        Test that the sign up URL resolves to the SignUpView.
        """
        url = reverse('sign-up')
        # Ensure that the resolved view class is SignUpView
        self.assertEqual(resolve(url).func.view_class, SignUpView)

    def test_login_url_resolves(self):
        """
        Test that the login URL resolves to the LoginView.
        """
        url = reverse('login')
        # Ensure that the resolved view class is LoginView
        self.assertEqual(resolve(url).func.view_class, LoginView)

    def test_generate_contract_url_resolves(self):
        """
        Test that the generate contract URL resolves to the GenerateContractView.
        """
        url = reverse('generate-contract')
        # Ensure that the resolved view class is GenerateContractView
        self.assertEqual(resolve(url).func.view_class, GenerateContractView)

    def test_delete_contract_url_resolves(self):
        """
        Test that the delete contract URL resolves to the DeleteContractView.
        """
        url = reverse('delete-contract', kwargs={'contract_name': 'sample_contract'})
        # Ensure that the resolved view class is DeleteContractView
        self.assertEqual(resolve(url).func.view_class, DeleteContractView)

    def test_fetch_contracts_url_resolves(self):
        """
        Test that the fetch contracts URL resolves to the FetchContractsView.
        """
        url = reverse('get-user-contracts')
        # Ensure that the resolved view class is FetchContractsView
        self.assertEqual(resolve(url).func.view_class, FetchContractsView)

    def test_checksum_address_url_resolves(self):
        """
        Test that the checksum address URL resolves to the CheckSumAddressView.
        """
        url = reverse('get-valid-checksum-address', kwargs={'address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3'})
        # Ensure that the resolved view class is CheckSumAddressView
        self.assertEqual(resolve(url).func.view_class, CheckSumAddressView)

    def test_post_list_create_url_resolves(self):
        """
        Test that the post list create URL resolves to the PostListCreateView.
        """
        url = reverse('post-list-create')
        # Ensure that the resolved view class is PostListCreateView
        self.assertEqual(resolve(url).func.view_class, PostListCreateView)

    def test_post_detail_url_resolves(self):
        """
        Test that the post detail URL resolves to the PostDetailView.
        """
        url = reverse('post-detail', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, PostDetailView)

    def test_comment_create_url_resolves(self):
        """
        Test that the comment create URL resolves to the CommentCreateView.
        """
        url = reverse('comment-create', args=[1])  # 1 is the post id
        # Ensure that the resolved view class is CommentCreateView
        self.assertEqual(resolve(url).func.view_class, CommentCreateView)

    def test_comment_list_url_resolves(self):
        """
        Test that the comment list URL resolves to the CommentListView.
        """
        url = reverse('comment-list', args=[1])  # 1 is the post id
        # Ensure that the resolved view class is CommentListView
        self.assertEqual(resolve(url).func.view_class, CommentListView)

    def test_like_create_delete_url_resolves(self):
        """
        Test that the like create delete URL resolves to the LikeCreateDeleteView.
        """
        url = reverse('like-create-delete', args=[1])  # 1 is the post id
        # Ensure that the resolved view class is LikeCreateDeleteView
        self.assertEqual(resolve(url).func.view_class, LikeCreateDeleteView)

    def test_save_token_url_resolves(self):
        """
        Test that the save token URL resolves to the SaveTokenView.
        """
        url = reverse('save-token')
        # Ensure that the resolved view class is SaveTokenView
        self.assertEqual(resolve(url).func.view_class, SaveTokenView)

    def test_delete_token_url_resolves(self):
        """
        Test that the delete token URL resolves to the DeleteTokenView.
        """
        url = reverse('delete-token')
        # Ensure that the resolved view class is DeleteTokenView
        self.assertEqual(resolve(url).func.view_class, DeleteTokenView)