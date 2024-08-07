from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory
from Accounts.models import User
from django.contrib.auth import get_user_model
from ..models import *
from ..serialisers import *

User = get_user_model()


class TestPostSerialiser(TestCase):
    """
    Test cases for the PostSerialiser to ensure correct serialisation and deserialisation of Post objects.
    """

    def setUp(self):
        """
        Set up test data including users, posts, and likes.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.non_author = User.objects.create_user(
            username='notauthor',
            email='notauthor@example.com',
            password='password123'
        )
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.post = Post.objects.create(title='Sample Post', description='Sample Description', author=self.user)
        Like.objects.create(post=self.post, user=self.non_author)

    def test_serialise_post(self):
        """
        Test that a Post object is correctly serialised.
        """
        request = self.factory.get('/')
        request.user = self.user
        serialiser = PostSerialiser(self.post, context={'request': request})
        data = serialiser.data
        self.assertEqual(data['like_count'], 1)
        self.assertFalse(data['user_has_liked'])
        self.assertTrue(data['is_user_author'])

    def test_create_post(self):
        """
        Test that a Post object is correctly created from valid data.
        """
        request = self.factory.get('/')
        request.user = self.user
        post_data = {'title': 'New Post', 'description': 'Content of the new post'}
        serialiser = PostSerialiser(data=post_data, context={'request': request})
        self.assertTrue(serialiser.is_valid())
        post = serialiser.save()
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.title, 'New Post')

    def test_user_has_liked(self):
        """
        Test that the serialiser correctly identifies if the user has liked the post.
        """
        request = self.factory.get('/')
        request.user = self.non_author
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertTrue(serialiser.data['user_has_liked'], "User should have liked the post")

    def test_user_has_not_liked(self):
        """
        Test that the serialiser correctly identifies if the user has not liked the post.
        """
        request = self.factory.get('/')
        request.user = self.user
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertFalse(serialiser.data['user_has_liked'], "User should not have liked the post")

    def test_user_has_not_liked_unauthorised(self):
        """
        Test that an unauthenticated user is correctly identified as not having liked the post.
        """
        request = self.factory.get('/')
        request.user = AnonymousUser()
        self.client.logout()
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertFalse(serialiser.get_user_has_liked(self.post), "User should not have liked the post as they are "
                                                                   "not authenticated")

    def test_user_is_author(self):
        """
        Test that the serialiser correctly identifies if the user is the author of the post.
        """
        request = self.factory.get('/')
        request.user = self.user
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertTrue(serialiser.data['is_user_author'], "User should be the author of the post")

    def test_user_is_not_author(self):
        """
        Test that the serialiser correctly identifies if the user is not the author of the post.
        """
        request = self.factory.get('/')
        request.user = self.non_author
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertFalse(serialiser.data['is_user_author'], "User should not be the author of the post")

    def test_user_is_not_author_unauthorised(self):
        """
        Test that an unauthenticated user is correctly identified as not being the author of the post.
        """
        request = self.factory.get('/')
        self.client.logout()
        serialiser = PostSerialiser(self.post, context={'request': request})
        self.assertFalse(serialiser.get_is_user_author(self.post), "User should not be permitted to call this method "
                                                                   "as they are not authenticated")


class TestCommentSerialiser(TestCase):
    """
    Test cases for the CommentSerialiser to ensure correct serialisation and deserialisation of Comment objects.
    """

    def setUp(self):
        """
        Set up test data including a user, post, and comment.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(title='Test Post', description='Test Description', author=self.user)
        self.comment = Comment.objects.create(post=self.post, author=self.user, content='A test comment')

    def test_serialise_comment(self):
        """
        Test that a Comment object is correctly serialised.
        """
        serialiser = CommentSerialiser(self.comment)
        data = serialiser.data
        self.assertEqual(data['author_username'], self.user.username)
        self.assertEqual(data['content'], 'A test comment')

    def test_create_comment(self):
        """
        Test that a Comment object is correctly created from valid data.
        """
        comment_data = {'post': self.post.id, 'author': self.user.id, 'content': 'New comment'}
        serialiser = CommentSerialiser(data=comment_data)
        if serialiser.is_valid():
            comment = serialiser.save()
            self.assertIsInstance(comment, Comment)
            self.assertEqual(comment.content, 'New comment')
        else:
            self.fail(serialiser.errors)


class TestLikeSerialiser(TestCase):
    """
    Test cases for the LikeSerialiser to ensure correct serialisation and deserialisation of Like objects.
    """

    def setUp(self):
        """
        Set up test data including a user and a post.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(title='Test Post', description='Test Description', author=self.user)

    def test_create_like(self):
        """
        Test that a Like object is correctly created from valid data.
        """
        like_data = {'post': self.post.id, 'user': self.user.id}
        serialiser = LikeSerialiser(data=like_data)
        self.assertTrue(serialiser.is_valid())
        like = serialiser.save()
        self.assertIsInstance(like, Like)
        self.assertEqual(like.user, self.user)

    def test_serialise_like(self):
        """
        Test that a Like object is correctly serialised.
        """
        like = Like.objects.create(post=self.post, user=self.user)
        serialiser = LikeSerialiser(like)
        self.assertEqual(serialiser.data['user'], self.user.id)
