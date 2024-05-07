from rest_framework import serializers
from .models import NotificationPushToken


class NotificationPushTokenSerialiser(serializers.ModelSerializer):
    class Meta:
        model = NotificationPushToken
        fields = ('token', 'created_at')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        user = self.context['request'].user
        token, created = NotificationPushToken.objects.update_or_create(user=user, defaults=validated_data)
        return token
