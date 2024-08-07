from rest_framework import serializers as serialisers
from .models import User, AuthenticationPushToken
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


# Serialiser enabling unregistered users to sign up
class SignUpSerialiser(serialisers.ModelSerializer):
    """Serialiser enabling unregistered users to sign up."""

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password_confirmation']

    # Email field with unique validation to ensure no duplicate emails are used
    email = serialisers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all()
        )
        ]
    )

    # Password field with multiple validators including password strength and regex
    password = serialisers.CharField(
        label='Password',
        write_only=True,
        required=True,
        validators=[
            # Uses Django's built-in password validation
            validate_password,
            RegexValidator(
                regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$&+,:;=?@#|<>.^*()%!-]).*$',
                message='Password must contain an uppercase character, a lowercase character, a number and a special '
                        'character.'
            )
        ]
    )

    # Password confirmation field to ensure users enter the same password twice
    password_confirmation = serialisers.CharField(
        label='Confirm password',
        write_only=True,
        required=True
    )

    # Custom validation to ensure password and password_confirmation match
    def validate(self, attrs):
        """Validate the data and generate messages for any errors."""
        super().validate(attrs)
        if attrs['password'] != attrs['password_confirmation']:
            raise serialisers.ValidationError({"new_password": "Password fields didn't match."})

        return attrs

    # Create a new user instance
    def create(self, validated_data):
        """Create a new user."""
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(self.validated_data['password'])
        user.save()

        return user


# Serialiser for the User model, providing essential user information
class UserSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


# Serialiser for the AuthenticationPushToken model
class AuthenticationPushTokenSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = AuthenticationPushToken
        fields = ('token', 'created_at')
        # Make the created_at field read-only
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        """Create or update a push token associated with the user."""
        user = self.context['request'].user
        # Ensure the token is associated with the correct user and use the validated data for the token
        token, created = AuthenticationPushToken.objects.update_or_create(user=user, defaults=validated_data)
        return token
