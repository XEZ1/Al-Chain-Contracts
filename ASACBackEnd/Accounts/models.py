from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


# Create your models here.
class User(AbstractUser):
    """User model used for authentication."""

    username = models.CharField(
        max_length=15,
        unique=True,
        validators=[RegexValidator(
            regex=r'^(?=.*[a-zA-Z]{3,}).*$',
            message='Username must contain at least 3 alphabetical characters'
        )]
    )
    first_name = models.CharField(
        max_length=15,
        blank=False
    )
    last_name = models.CharField(
        max_length=15,
        blank=False
    )
    email = models.EmailField(
        unique=True,
        max_length=35,
        blank=False
    )
    paying_user = models.BooleanField(
        default=False
    )


class AuthenticationPushToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='authorisation_tokens')
    token = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token}"


