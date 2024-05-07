from .models import NotificationPushToken
from rest_framework import status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationPushTokenSerialiser


class SaveTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serialiser = NotificationPushTokenSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

        # token = request.data.get('token')
        # NotificationPushToken.objects.update_or_create(user=request.user, defaults={'token': token})
        # return Response({'status': 'success'}, status=status.HTTP_200_OK)


class DeleteTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        NotificationPushToken.objects.filter(user=request.user).delete()
        return Response({'status': 'success'}, status=status.HTTP_204_NO_CONTENT)
