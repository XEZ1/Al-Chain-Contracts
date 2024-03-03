from django.urls import path
from .views import *

urlpatterns = [
    path('generate-contract/', ContractView.as_view(), name='generate-contract'),
]