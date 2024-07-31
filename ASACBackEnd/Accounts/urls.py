from django.urls import path
from .views import ValidateAuthenticationTokenView, SignUpView, LoginView, AuthenticationPushTokenView


# Define URL patterns for the Accounts application
urlpatterns = [
    # URL pattern for handling push tokens
    # Maps the 'push-token/' URL to the AuthenticationPushTokenView view
    # This view handles creating, retrieving, and deleting authentication push tokens
    path('push-token/', AuthenticationPushTokenView.as_view(), name='push-token'),

    # URL pattern for validating authentication tokens
    # Maps the 'validate-token/' URL to the ValidateAuthenticationTokenView view
    # This view checks the validity of authentication tokens
    path('validate-token/', ValidateAuthenticationTokenView.as_view(), name='validate-token'),

    # URL pattern for user sign-up
    # Maps the 'sign-up/' URL to the SignUpView view
    # This view handles the registration of new users
    path('sign-up/', SignUpView.as_view(), name='sign-up'),

    # URL pattern for user login
    # Maps the 'login/' URL to the LoginView view
    # This view handles user login and token generation
    path('login/', LoginView.as_view(), name='login'),
]
