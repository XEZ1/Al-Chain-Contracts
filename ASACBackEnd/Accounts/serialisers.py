from rest_framework import serializers as serialisers
from .models import User, AuthenticationPushToken
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class SignUpSerialiser(serialisers.ModelSerializer):
    """Serialiser enabling unregistered users to sign up."""

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password_confirmation']

    email = serialisers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all()
        )
        ]
    )

    password = serialisers.CharField(
        label='Password',
        write_only=True,
        required=True,
        validators=[
            validate_password,
            RegexValidator(
                regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$&+,:;=?@#|<>.^*()%!-]).*$',
                message='Password must contain an uppercase character, a lowercase character, a number and a special '
                        'character.'
            )
        ]
    )

    password_confirmation = serialisers.CharField(
        label='Confirm password',
        write_only=True,
        required=True
    )

    def validate(self, attrs):
        """Validate the data and generate messages for any errors."""

        super().validate(attrs)
        if attrs['password'] != attrs['password_confirmation']:
            raise serialisers.ValidationError({"new_password": "Password fields didn't match."})

        return attrs

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


class UserSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


class AuthenticationPushTokenSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = AuthenticationPushToken
        fields = ('token', 'created_at')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        user = self.context['request'].user
        token, created = AuthenticationPushToken.objects.update_or_create(user=user, defaults=validated_data)
        return token
