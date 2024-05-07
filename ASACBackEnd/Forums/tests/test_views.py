from unittest.mock import patch
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from Notifications.models import NotificationPushToken
from ..models import User, Post, Comment, Like
from rest_framework.authtoken.models import Token


class ViewTestCase(TestCase):
    def setUp(self):
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
    def test_get_posts(self):
        response = self.client.get(reverse('post-list-create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_post_authenticated(self):
        data = {'title': 'New Post', 'description': 'New post description'}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_create_post_unauthenticated(self):
        self.client.credentials()  # Remove any authentication tokens
        data = {'title': 'New Post', 'description': 'New post description'}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_invalid(self):
        data = {}
        response = self.client.post(reverse('post-list-create'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestPostDetailView(ViewTestCase):
    def test_get_post_detail(self):
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.post.id)

    def test_update_post_owner(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('post-detail', args=[self.post.id])
        data = {'title': 'Updated Title', 'description': 'Updated description'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_post = Post.objects.get(id=self.post.id)
        self.assertEqual(updated_post.title, 'Updated Title')

    def test_update_post_non_owner(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse('post-detail', args=[self.post.id])
        data = {'title': 'Unauthorized Update', 'description': 'Attempt to update'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_post_invalid(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('post-detail', args=[self.post.id])
        data = {}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_post_owner(self):
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_post_non_owner(self):
        self.client.force_authenticate(user=self.user2)  # Switch to non-owner user
        url = reverse('post-detail', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestCommentCreateView(ViewTestCase):
    def test_create_comment(self):
        url = reverse('comment-create', args=[self.post.id])
        data = {'content': 'This is a comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_create_comment_invalid(self):
        url = reverse('comment-create', args=[self.post.id])
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestCommentListView(ViewTestCase):
    def test_list_comments(self):
        url = reverse('comment-list', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class TestLikeCreateDeleteView(ViewTestCase):
    def test_like_post(self):
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Like.objects.filter(post=self.post, user=self.user1).exists())

    def test_unlike_post(self):
        Like.objects.create(post=self.post, user=self.user1)
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Like.objects.filter(post=self.post, user=self.user1).exists())

    def test_like_existing_post(self):
        Like.objects.create(post=self.post, user=self.user1)
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_like_nonexistent_post(self):
        url = reverse('like-create-delete', args=[99999])  # Nonexistent post ID
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent_like(self):
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('Forums.views.send_push_notification')
    def test_send_notification_on_like(self, mock_send_notification):
        NotificationPushToken.objects.create(user=self.user1, token='dummy_token')
        url = reverse('like-create-delete', args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_notification.assert_called_once_with('dummy_token', "New Like", f"{self.user1.username} liked your post.")
