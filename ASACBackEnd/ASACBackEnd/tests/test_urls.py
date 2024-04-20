from django.test import SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.admin.sites import AdminSite
from Accounts.views import *
from Notifications.views import *
from Contracts.views import *
from Forums.views import *


class TestUrls(SimpleTestCase):

    def test_admin_url_resolves(self):
        url = reverse('admin:index')
        resolved = resolve(url)
        self.assertEqual(resolved.func.__name__, AdminSite.index.__name__)
        self.assertEqual(resolved.func.__class__, AdminSite.index.__class__)

    def test_push_token_url_resolves(self):
        url = reverse('push_token')
        self.assertEqual(resolve(url).func.view_class, AuthenticationPushTokenView)

    def test_validate_token_url_resolves(self):
        url = reverse('validate_token')
        self.assertEqual(resolve(url).func.view_class, ValidateAuthenticationTokenView)

    def test_sign_up_url_resolves(self):
        url = reverse('sign_up')
        self.assertEqual(resolve(url).func.view_class, SignUpView)

    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, LoginView)

    def test_generate_contract_url_resolves(self):
        url = reverse('generate-contract')
        self.assertEqual(resolve(url).func.view_class, GenerateContractView)

    def test_delete_contract_url_resolves(self):
        url = reverse('delete-contract')
        self.assertEqual(resolve(url).func.view_class, DeleteContractView)

    def test_fetch_contracts_url_resolves(self):
        url = reverse('get-user-contracts')
        self.assertEqual(resolve(url).func.view_class, FetchContractsView)

    def test_checksum_address_url_resolves(self):
        url = reverse('get-valid-checksum-address')
        self.assertEqual(resolve(url).func.view_class, CheckSumAddressView)

    def test_post_list_create_url_resolves(self):
        url = reverse('post-list-create')
        self.assertEqual(resolve(url).func.view_class, PostListCreateView)

    def test_post_detail_url_resolves(self):
        url = reverse('post-detail', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, PostDetailView)

    def test_comment_create_url_resolves(self):
        url = reverse('comment-create', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, CommentCreateView)

    def test_comment_list_url_resolves(self):
        url = reverse('comment-list', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, CommentListView)

    def test_like_create_delete_url_resolves(self):
        url = reverse('like-create-delete', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, LikeCreateDeleteView)

    def test_save_token_url_resolves(self):
        url = reverse('save-token')
        self.assertEqual(resolve(url).func.view_class, SaveTokenView)

    def test_delete_token_url_resolves(self):
        url = reverse('delete-token')
        self.assertEqual(resolve(url).func.view_class, DeleteTokenView)