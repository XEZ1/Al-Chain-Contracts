from django.db import models
from Accounts.models import User


class Post(models.Model):
    """
    Model representing a forum post.
    Contains fields for the title, description, timestamps, and author.
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_posts')

    def __str__(self):
        """
        Return the string representation of the post, which is its title.
        """
        return self.title

    @property
    def like_count(self):
        """
        Return the number of likes associated with the post.
        """
        return self.likes.count()


class Comment(models.Model):
    """
    Model representing a comment on a forum post.
    Contains fields for the associated post, author, content, and timestamp.
    """
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Return the string representation of the comment, which includes the author's name and the post title.
        """
        return f"Comment by {self.author} on {self.post}"


class Like(models.Model):
    """
    Model representing a like on a forum post.
    Contains fields for the associated post, user, and timestamp.
    """
    post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Meta options for the Like model.
        Ensures that a user can only like a post once.
        """
        unique_together = ('post', 'user')

    def __str__(self):
        """
        Return the string representation of the like, which includes the user's name and the post title.
        """
        return f"Like by {self.user} on {self.post}"