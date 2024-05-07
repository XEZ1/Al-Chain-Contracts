from django.db import models
from django.conf import settings
from Accounts.models import User


class NotificationPushToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token}"