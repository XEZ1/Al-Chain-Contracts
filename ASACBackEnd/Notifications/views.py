from .models import PushToken
from rest_framework import status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class SaveTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        PushToken.objects.update_or_create(user=request.user, defaults={'token': token})
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class DeleteTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        PushToken.objects.filter(user=request.user).delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)




# Delete the test functionality later on
from channels.layers import get_channel_layer
from django.http import JsonResponse
from asgiref.sync import async_to_sync
def test_notification(request):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "test_group",
        {
            "type": "send_notification",
            "message": "Test message from Django"
        }
    )
    return JsonResponse({"status": "Notification sent"})