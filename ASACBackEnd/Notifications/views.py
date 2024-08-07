from .models import NotificationPushToken
from rest_framework import status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serialisers import NotificationPushTokenSerialiser


class SaveTokenView(views.APIView):
    """
    API view to handle saving push notification tokens.
    Requires the user to be authenticated.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save a push notification token for the authenticated user.

        @param request: The request object containing the token data.
        @return: A success response if the token is saved, or an error response if the data is invalid.
        """
        data = request.data.copy()
        data['user'] = request.user.id

        serialiser = NotificationPushTokenSerialiser(data=data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteTokenView(views.APIView):
    """
    API view to handle deleting push notification tokens.
    Requires the user to be authenticated.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Delete all push notification tokens for the authenticated user.

        @param request: The request object.
        @return: A success response indicating that the tokens have been deleted.
        """
        NotificationPushToken.objects.filter(user=request.user).delete()
        return Response({'status': 'success'}, status=status.HTTP_204_NO_CONTENT)
