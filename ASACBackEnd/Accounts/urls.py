from django.urls import path
from .views import SignUp, validate_token
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('sign_up/', SignUp.as_view(), name='sign_up'),
    path('login/', obtain_auth_token, name='login'),
    path('validate_token', validate_token, name='validate_token'),
]