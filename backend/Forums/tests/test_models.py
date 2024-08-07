from django.test import TestCase
from django.utils import timezone
from ..models import Post, Comment, Like
from Accounts.models import User
from django.db.utils import IntegrityError


class PostModelTest(TestCase):
    """
    Test cases for the Post model to ensure it is functioning correctly.
    """

    @classmethod
    def setUpTestData(self):
        """
        Set up test data for the Post model, including creating a user and a post.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(
            title='Test Post',
            description='This is a test post',
            author=self.user
        )

    def test_field_attributes_for_post(self):
        """
        Verify the field attributes for the Post model, such as title, description, and timestamps.
        """
        post = Post.objects.get(id=self.post.id)
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.description, 'This is a test post')
        self.assertEqual(self.post._meta.get_field('title').max_length, 255)
        self.assertIsInstance(post.created_at, timezone.datetime)
        self.assertIsInstance(post.updated_at, timezone.datetime)
        self.assertIsInstance(post.author, User)

    def test_post_string_representation(self):
        """
        Test the string representation of the Post model.
        """
        self.assertEqual(str(self.post), 'Test Post')

    def test_like_count_property(self):
        """
        Verify the like_count property for the Post model.
        """
        Like.objects.create(post=self.post, user=self.user)
        self.assertEqual(self.post.like_count, 1)


class CommentModelTest(TestCase):
    """
    Test cases for the Comment model to ensure it is functioning correctly.
    """

    @classmethod
    def setUpTestData(self):
        """
        Set up test data for the Comment model, including creating a user, a post, and a comment.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(
            title='Another Test Post',
            description='Just another test post',
            author=self.user
        )
        self.comment = Comment.objects.create(
            post=self.post,
            author=self.user,
            content='This is a comment'
        )

    def test_field_attributes_for_comment(self):
        """
        Verify the field attributes for the Comment model, such as content, post, author, and timestamp.
        """
        comment = Comment.objects.get(id=self.comment.id)
        self.assertEqual(comment.content, 'This is a comment')
        self.assertIsInstance(comment.post, Post)
        self.assertIsInstance(comment.author, User)
        self.assertIsInstance(comment.created_at, timezone.datetime)

    def test_comment_string_representation(self):
        """
        Test the string representation of the Comment model.
        """
        expected_string = f"Comment by {self.user} on {self.post}"
        self.assertEqual(str(self.comment), expected_string)


class LikeModelTest(TestCase):
    """
    Test cases for the Like model to ensure it is functioning correctly.
    """

    @classmethod
    def setUpTestData(self):
        """
        Set up test data for the Like model, including creating a user, a post, and a like.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.post = Post.objects.create(
            title='Liked Post',
            description='A post to like',
            author=self.user
        )
        self.like = Like.objects.create(
            post=self.post,
            user=self.user
        )

    def test_field_attributes_for_like(self):
        """
        Verify the field attributes for the Like model, such as post, user, and timestamp.
        """
        like = Like.objects.get(id=self.like.id)
        self.assertIsInstance(like.post, Post)
        self.assertIsInstance(like.user, User)
        self.assertIsInstance(like.created_at, timezone.datetime)

    def test_like_unique_together(self):
        """
        Test the unique_together constraint for the Like model.
        """
        with self.assertRaises(IntegrityError):
            Like.objects.create(post=self.post, user=self.user)

    def test_like_string_representation(self):
        """
        Test the string representation of the Like model.
        """
        expected_string = f"Like by {self.user} on {self.post}"
        self.assertEqual(str(self.like), expected_string)
