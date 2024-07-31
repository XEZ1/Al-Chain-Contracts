from django.urls import path
from .views import ValidateAuthenticationTokenView, SignUpView, LoginView, AuthenticationPushTokenView


urlpatterns = [
    path('push-token/', AuthenticationPushTokenView.as_view(), name='push-token'),
    path('validate-token/', ValidateAuthenticationTokenView.as_view(), name='validate-token'),
    path('sign-up/', SignUpView.as_view(), name='sign-up'),
    path('login/', LoginView.as_view(), name='login'),
]
