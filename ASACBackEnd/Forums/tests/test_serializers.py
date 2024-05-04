from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory
from Accounts.models import User
from django.contrib.auth import get_user_model
from ..models import *
from ..serializers import *


User = get_user_model()


class TestPostSerializer(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.post = Post.objects.create(title='Sample Post', description='Sample Description', author=self.user)

    def test_serialise_post(self):
        request = self.factory.get('/')
        request.user = self.user
        serialiser = PostSerialiser(self.post, context={'request': request})
        data = serialiser.data
        self.assertEqual(data['like_count'], 0)
        self.assertFalse(data['user_has_liked'])
        self.assertTrue(data['is_user_author'])

    def test_create_post(self):
        request = self.factory.get('/')
        request.user = self.user
        post_data = {'title': 'New Post', 'description': 'Content of the new post'}
        serialiser = PostSerialiser(data=post_data, context={'request': request})
        self.assertTrue(serialiser.is_valid())
        post = serialiser.save()
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.title, 'New Post')


class TestCommentSerializer(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(title='Test Post', description='Test Description', author=self.user)
        self.comment = Comment.objects.create(post=self.post, author=self.user, content='A test comment')

    def test_serialize_comment(self):
        serialiser = CommentSerialiser(self.comment)
        data = serialiser.data
        self.assertEqual(data['author_username'], self.user.username)
        self.assertEqual(data['content'], 'A test comment')

    def test_create_comment(self):
        comment_data = {'post': self.post.id, 'author': self.user.id, 'content': 'New comment'}
        serialiser = CommentSerialiser(data=comment_data)
        if serialiser.is_valid():
            comment = serialiser.save()
            self.assertIsInstance(comment, Comment)
            self.assertEqual(comment.content, 'New comment')
        else:
            self.fail(serialiser.errors)


class TestLikeSerialiser(TestCase):

    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(title='Test Post', description='Test Description', author=self.user)

    def test_create_like(self):
        like_data = {'post': self.post.id, 'user': self.user.id}
        serialiser = LikeSerialiser(data=like_data)
        self.assertTrue(serialiser.is_valid())
        like = serialiser.save()
        self.assertIsInstance(like, Like)
        self.assertEqual(like.user, self.user)

    def test_serialize_like(self):
        like = Like.objects.create(post=self.post, user=self.user)
        serialiser = LikeSerialiser(like)
        self.assertEqual(serialiser.data['user'], self.user.id)
