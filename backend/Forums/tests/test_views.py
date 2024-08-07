from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from Notifications.models import NotificationPushToken
from ..models import User, Post, Comment, Like
from rest_framework.authtoken.models import Token


class ViewTestCase(TestCase):
    """
    Base test case for setting up common test data and configurations.
    """
    def setUp(self):
        """
        Set up test data including users, posts, comments, and authentication tokens.
        """
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='testpass'
        )
        self.user2 = User.objects.create_user(
            username='otheruser',
            first_name='other',
            last_name='user',
            email='otheruser@kcl.ac.uk',
            password='otherpass'
        )
        self.post = Post.objects.create(title="Test Post", description="Test Description", author=self.user1)
        self.comment = Comment.objects.create(post=self.post, author=self.user2, content="Nice post!")
        self.token = Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


class TestPostListCreateView(ViewTestCase):
    """
    Test suite for the PostListCreateView.
    """
    def test_get_posts(self):
        """
        Ensure that all posts are retrieved successfully.
        """
        response = self.client.get(reverse('post-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_post_authenticated(self):
        """
        Ensure that an authenticated user can create a post.
        """
        data = {'title': 'New Post', 'description': 'New post description'}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_create_post_unauthenticated(self):
        """
        Ensure that an unauthenticated user cannot create a post.
        """
        self.client.credentials()  # Remove any authentication tokens
        data = {'title': 'New Post', 'description': 'New post description'}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_invalid(self):
        """
        Ensure that invalid post data is handled properly.
        """
        data = {}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestPostDetailView(ViewTestCase):
    """
    Test suite for the PostDetailView.
    """
    def test_get_post_detail(self):
        """
        Ensure that a specific post can be retrieved by its ID.
        """
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.post.id)

    def test_update_post_owner(self):
        """
        Ensure that the post owner can update their post.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('post-detail', args=[self.post.id])
        data = {'title': 'Updated Title', 'description': 'Updated description'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_post = Post.objects.get(id=self.post.id)
        self.assertEqual(updated_post.title, 'Updated Title')

    def test_update_post_non_owner(self):
        """
        Ensure that a user who is not the post owner cannot update the post.
        """
        self.client.force_authenticate(user=self.user2)
        url = reverse('post-detail', args=[self.post.id])
        data = {'title': 'Unauthorized Update', 'description': 'Attempt to update'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_post_invalid(self):
        """
        Ensure that invalid data is handled properly when updating a post.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('post-detail', args=[self.post.id])
        data = {}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_post_owner(self):
        """
        Ensure that the post owner can delete their post.
        """
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_post_non_owner(self):
        """
        Ensure that a user who is not the post owner cannot delete the post.
        """
        self.client.force_authenticate(user=self.user2)  # Switch to non-owner user
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestCommentCreateView(ViewTestCase):
    """
    Test cases for the CommentCreateView.
    """
    def test_create_comment(self):
        """
        Ensure that an authenticated user can create a comment on a post.
        """
        url = reverse('comment-create', args=[self.post.id])
        data = {'content': 'This is a comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_create_comment_invalid(self):
        """
        Ensure that invalid comment data is handled properly.
        """
        url = reverse('comment-create', args=[self.post.id])
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestCommentListView(ViewTestCase):
    """
    Test cases for the CommentListView.
    """
    def test_list_comments(self):
        """
        Ensure that all comments for a specific post are retrieved successfully.
        """
        url = reverse('comment-list', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class TestLikeCreateDeleteView(ViewTestCase):
    """
    Test cases for the LikeCreateDeleteView.
    """
    def test_like_post(self):
        """
        Ensure that an authenticated user can like a post.
        """
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Like.objects.filter(post=self.post, user=self.user1).exists())

    def test_unlike_post(self):
        """
        Ensure that an authenticated user can unlike a post.
        """
        Like.objects.create(post=self.post, user=self.user1)
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Like.objects.filter(post=self.post, user=self.user1).exists())

    def test_like_existing_post(self):
        """
        Ensure that liking a post that has already been liked by the user results in unliking it.
        """
        Like.objects.create(post=self.post, user=self.user1)
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_like_nonexistent_post(self):
        """
        Ensure that attempting to like a nonexistent post returns a 404 status.
        """
        url = reverse('like-create-delete', args=[99999])  # Nonexistent post ID
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent_like(self):
        """
        Ensure that attempting to delete a like that does not exist returns a 404 status.
        """
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('Forums.views.send_push_notification')
    def test_send_notification_on_like(self, mock_send_notification):
        """
        Ensure that a notification is sent when a post is liked.
        """
        NotificationPushToken.objects.create(user=self.user1, token='dummy_token')
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_notification.assert_called_once_with('dummy_token', "New Like", f"{self.user1.username} liked your post.")
