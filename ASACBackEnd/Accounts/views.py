from rest_framework import generics, status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import exception_handler
from Notifications.models import NotificationPushToken
from Notifications.utils import send_push_notification
from .serializers import SignUpSerialiser, UserSerialiser, AuthenticationPushTokenSerialiser
from Accounts.models import User, AuthenticationPushToken


class ValidateAuthenticationTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return Response({'token_valid': True})
        # return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)

    def handle_exception(self, exc):
        response = exception_handler(exc, self.get_renderer_context())
        if isinstance(exc, AuthenticationFailed):
            return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)
        return response


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            notification_push_token = NotificationPushToken.objects.filter(user=user).first()
            if notification_push_token:
                send_push_notification(notification_push_token.token, "Welcome Back!", "You've successfully logged in.")
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerialiser
    queryset = User.objects.all()


class AuthenticationPushTokenView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serialiser = AuthenticationPushTokenSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            push_token = AuthenticationPushToken.objects.get(user=request.user)
            push_token.delete()
            return Response({"message": "Push token deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except AuthenticationPushToken.DoesNotExist:
            return Response({"error": "Push token not found"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        push_token = AuthenticationPushToken.objects.filter(user=request.user).first()
        if push_token:
            serialiser = AuthenticationPushTokenSerialiser(push_token)
            return Response(serialiser.data)
        return Response(status=status.HTTP_404_NOT_FOUND)
