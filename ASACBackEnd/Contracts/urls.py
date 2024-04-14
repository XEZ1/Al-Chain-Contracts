from django.urls import path
from .views import *


urlpatterns = [
    path('generate-contract/', GenerateContractView.as_view(), name='generate-contract'),
    path('delete-contract/', DeleteContractView.as_view(), name='delete-contract'),
    path('get-user-contracts/', FetchContractsView.as_view(), name='get-user-contracts'),
    path('get-valid-checksum-address/', CheckSumAddressView.as_view(), name='get-valid-checksum-address'),
]