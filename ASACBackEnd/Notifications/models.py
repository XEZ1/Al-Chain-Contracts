from django.db import models
from django.conf import settings
from Accounts.models import User


class NotificationPushToken(models.Model):
    """
    Model to store push notification tokens for users.
    Each token is associated with a user and has a creation timestamp.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Return a string representation of the token with the associated username.
        """
        return f"{self.user.username} - {self.token}"