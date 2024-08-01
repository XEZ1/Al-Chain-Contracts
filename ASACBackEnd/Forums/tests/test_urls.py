from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    """
    Test case for verifying that URL patterns resolve to the correct views.
    """

    def test_post_list_create_url_resolves(self):
        """
        Test that the URL for listing and creating posts resolves to the PostListCreateView.
        """
        url = reverse('post-list-create')
        self.assertEqual(resolve(url).func.view_class, PostListCreateView)

    def test_post_detail_url_resolves(self):
        """
        Test that the URL for retrieving, updating, and deleting a specific post resolves to the PostDetailView.
        """
        url = reverse('post-detail', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, PostDetailView)

    def test_comment_create_url_resolves(self):
        """
        Test that the URL for creating a comment on a specific post resolves to the CommentCreateView.
        """
        url = reverse('comment-create', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, CommentCreateView)

    def test_comment_list_url_resolves(self):
        """
        Test that the URL for listing comments on a specific post resolves to the CommentListView.
        """
        url = reverse('comment-list', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, CommentListView)

    def test_like_create_delete_url_resolves(self):
        """
        Test that the URL for liking or unliking a specific post resolves to the LikeCreateDeleteView.
        """
        url = reverse('like-create-delete', args=[1])  # 1 is the post id
        self.assertEqual(resolve(url).func.view_class, LikeCreateDeleteView)
