from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import SignUpSerialiser, UserSerialiser
from Accounts.models import User
from rest_framework import generics, permissions


# Create your views here.
# Token validation for the user logged in.
# @api_view(['GET'])
# def validate_token(request):
#     user = User.objects.get(username=request.user.username)
#     if user:
#         return Response({'token_valid': True})
#     return Response({'token_valid': False})

@api_view(['GET'])
def validate_token(request):
    return Response({'token_valid': True})


class SignUp(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerialiser
    queryset = User.objects.all()

    def get(self, request):
        return Response({'detail': 'GET method not allowed.'})
