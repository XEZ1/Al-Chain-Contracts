from rest_framework import serializers
from .models import User, PushToken
from django.core.validators import RegexValidator
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class SignUpSerialiser(serializers.ModelSerializer):
    """Serialiser enabling unregistered users to sign up."""

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password_confirmation']

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all()
        )
        ]
    )

    password = serializers.CharField(
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

    password_confirmation = serializers.CharField(
        label='Confirm password',
        write_only=True,
        required=True
    )

    def validate(self, attrs):
        """Validate the data and generate messages for any errors."""

        super().validate(attrs)
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})

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


class UserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


class PushTokenSerialiser(serializers.ModelSerializer):
    class Meta:
        model = PushToken
        fields = ('token', 'created_at')
        read_only_fields = ('created_at',)  # 'created_at' should not be editable

    def create(self, validated_data):
        user = self.context['request'].user
        token, created = PushToken.objects.update_or_create(user=user, defaults=validated_data)
        return token
