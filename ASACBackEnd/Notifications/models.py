from django.db import models
from django.db import models
from django.conf import settings


class PushToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_tokens')
    token = models.CharField(max_length=255, unique=True)
