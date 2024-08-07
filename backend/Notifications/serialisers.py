from rest_framework import serializers as serialisers
from .models import NotificationPushToken


class NotificationPushTokenSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the NotificationPushToken model, handling the conversion between
    model instances and JSON representations.
    """
    class Meta:
        """
        Metadata class to define the model and fields to be serialised.
        """
        model = NotificationPushToken
        fields = ('token', 'created_at')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        """
        Create or update a NotificationPushToken instance associated with the current user.

        @param validated_data: The validated data from the request.
        @return: The created or updated NotificationPushToken instance.
        """
        user = self.context['request'].user
        token, created = NotificationPushToken.objects.update_or_create(user=user, defaults=validated_data)
        return token
