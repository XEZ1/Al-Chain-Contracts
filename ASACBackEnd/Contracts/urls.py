from django.urls import path
from .views import *

urlpatterns = [
    path('generate-contract/', GenerateContractView.as_view(), name='generate-contract'),
    path('get-user-contracts/', FetchContractsView.as_view(), name='get-user-contracts'),
]