from rest_framework import generics, status, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import SignUpSerialiser, UserSerialiser
from Accounts.models import User


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
