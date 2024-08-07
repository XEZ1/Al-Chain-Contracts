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
from .serialisers import SignUpSerialiser, UserSerialiser, AuthenticationPushTokenSerialiser
from Accounts.models import User, AuthenticationPushToken


class ValidateAuthenticationTokenView(views.APIView):
    """
    This view handles the validation of authentication tokens. It checks if the token provided by the user is valid.
    """
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        """
        Check if the user is authenticated and return a response indicating the token is valid.
        @param request: The HTTP/HTTPS request object containing the user's token.
        @return: A Response object indicating whether the token is valid.
        """
        if request.user and request.user.is_authenticated:
            return Response({'token_valid': True})
        # The following line is not needed since the exception_handler method will handle the exception
        # return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)

    def handle_exception(self, exc):
        """
        Handle exceptions and customise the response for authentication failures.

        @param exc: The exception that occurred.
        @return: A Response object indicating the result of the exception handling.
        """
        response = exception_handler(exc, self.get_renderer_context())
        if isinstance(exc, AuthenticationFailed):
            return Response({'token_valid': False}, status=status.HTTP_401_UNAUTHORIZED)
        return response


class LoginView(views.APIView):
    """
    This view handles user login. It verifies the provided credentials and generates an authentication token for the user.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Extract the username and password from the request data and authenticate the user.
        If authentication is successful, generate or retrieve the authentication token for the user,
        and send a welcome back notification if the user has a notification push token.

        @param request: The HTTP/HTTPS request object containing the login credentials.
        @return: A Response object containing the authentication token or an error message.
        """
        # Extract the username and password from the request data
        username = request.data.get("username")
        password = request.data.get("password")

        # Authenticate the user using the extracted credentials
        user = authenticate(username=username, password=password)

        if user:
            # Generate or retrieve the authentication token for the user
            token, _ = Token.objects.get_or_create(user=user)

            # Check if the user has a notification push token and send a welcome back notification
            notification_push_token = NotificationPushToken.objects.filter(user=user).first()
            if notification_push_token:
                send_push_notification(notification_push_token.token, "Welcome Back!", "You've successfully logged in.")

            # Return the token in the response
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            # Return an error response if the user credentials are invalid
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(generics.CreateAPIView):
    """
    This view handles user registration by using the SignUpSerialiser to validate and create new user accounts.
    """
    permission_classes = [AllowAny]
    serializer_class = SignUpSerialiser
    queryset = User.objects.all()


class AuthenticationPushTokenView(views.APIView):
    """
    This view manages authentication push tokens for users. It handles the creation, deletion, and retrieval of push tokens.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Validate the provided data using the AuthenticationPushTokenSerialiser.
        Create and save a new authentication push token if the data is valid.
        Return the created token data in the response or an error response if the data is invalid.

        @param request: The HTTP/HTTPS request object containing the push token data.
        @return: A Response object containing the created token data or an error message.
        """
        serialiser = AuthenticationPushTokenSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Attempt to delete the existing authentication push token for the authenticated user.
        Return a success message if the token is found and deleted or an error message if no token is found.

        @param request: The HTTP/HTTPS request object.
        @return: A Response object indicating the result of the delete operation.
        """
        try:
            push_token = AuthenticationPushToken.objects.get(user=request.user)
            push_token.delete()
            return Response({"message": "Push token deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except AuthenticationPushToken.DoesNotExist:
            return Response({"error": "Push token not found"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        """
        Retrieve the existing authentication push token for the authenticated user.
        Return the token data if found or a 404 Not Found response if no token is found.

        @param request: The HTTP request object.
        @return: A Response object containing the token data or a 404 Not Found status.
        """
        push_token = AuthenticationPushToken.objects.filter(user=request.user).first()
        if push_token:
            serialiser = AuthenticationPushTokenSerialiser(push_token)
            return Response(serialiser.data)
        return Response(status=status.HTTP_404_NOT_FOUND)
