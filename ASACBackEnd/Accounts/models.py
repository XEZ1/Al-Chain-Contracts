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
