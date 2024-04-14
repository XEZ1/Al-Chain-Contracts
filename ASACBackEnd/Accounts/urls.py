from django.urls import path
from .views import ValidateAuthenticationTokenView, SignUpView, LoginView, AuthenticationPushTokenView


urlpatterns = [
    path('push_token/', AuthenticationPushTokenView.as_view(), name='push_token'),
    path('validate_token/', ValidateAuthenticationTokenView.as_view(), name='validate_token'),
    path('sign_up/', SignUpView.as_view(), name='sign_up'),
    path('login/', LoginView.as_view(), name='login'),
]
