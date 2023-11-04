from django.urls import path
from .views import ValidateTokenView, SignUpView, LoginView, NotificationView, PushTokenView

urlpatterns = [
    path('validate_token/', ValidateTokenView.as_view(), name='validate_token'),
    path('sign_up/', SignUpView.as_view(), name='sign_up'),
    path('login/', LoginView.as_view(), name='login'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('push_token/', PushTokenView.as_view(), name='push_token'),
]
