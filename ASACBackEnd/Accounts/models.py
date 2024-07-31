from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


# Define the custom User model used for authentication
class User(AbstractUser):
    """User model used for authentication."""

    # Override the username field to include additional validation
    username = models.CharField(
        # Set the maximum length of the username to 15 characters
        max_length=15,
        # Each username should be unique
        unique=True,
        validators=[RegexValidator(
            # Regex pattern to ensure at least 3 alphabetical characters
            regex=r'^(?=.*[a-zA-Z]{3,}).*$',
            # Error message for invalid usernames
            message='Username must contain at least 3 alphabetical characters'
        )],
        # Username field cannot be blank
        blank=False
    )
    # Define the first name field
    first_name = models.CharField(
        # Set the maximum length of the first name to 15 characters
        max_length=15,
        # First name field cannot be blank
        blank=False
    )
    # Define the last name field
    last_name = models.CharField(
        # Set the maximum length of the last name to 15 characters
        max_length=15,
        # Last name field cannot be blank
        blank=False
    )
    # Define the email field
    email = models.EmailField(
        # Each email address should be unique
        unique=True,
        # Set the maximum length of the email to 35 characters
        max_length=35,
        # Email field cannot be blank
        blank=False
    )


# Define the model to store authentication push tokens
class AuthenticationPushToken(models.Model):
    # Associate each token with a unique user
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='authorisation_tokens')
    # Store the token as a unique string with a maximum length of 200 characters
    token = models.CharField(max_length=200, unique=True)
    # Automatically set the field to the current date and time when the token is created
    created_at = models.DateTimeField(auto_now_add=True)

    # Define the string representation of the model
    def __str__(self):
        return f"{self.user.username} - {self.token}"


