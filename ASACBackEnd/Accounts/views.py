from rest_framework import generics, status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import SignUpSerialiser, UserSerialiser, PushTokenSerialiser, NotificationSerialiser
from Accounts.models import User, PushToken, Notification




class ValidateTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        try:
            # If authentication is successful, `request.user` will be set,
            # and we'll enter this block.
            if request.user and request.user.is_authenticated:
                return Response({'token_valid': True})
            else:
                return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)
        except AuthenticationFailed:
            return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerialiser
    queryset = User.objects.all()


class PushTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serialiser = PushTokenSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            push_token = PushToken.objects.get(user=request.user)
            push_token.delete()
            return Response({"message": "Push token deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except PushToken.DoesNotExist:
            return Response({"error": "Push token not found"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        push_token = PushToken.objects.filter(user=request.user).first()
        if push_token:
            serialiser = PushTokenSerialiser(push_token)
            return Response(serialiser.data)
        return Response(status=status.HTTP_404_NOT_FOUND)


class NotificationView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        serialiser = NotificationSerialiser(notifications, many=True)
        return Response(serialiser.data)

    def post(self, request):
        data = request.data.copy()
        data['recipient'] = request.user.id  # Assuming the notification is for the user making the request
        serialiser = NotificationSerialiser(data=data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

