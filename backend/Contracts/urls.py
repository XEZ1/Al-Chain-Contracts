from django.urls import path
from .views import *


urlpatterns = [
    # URL pattern for generating a new contract
    # Routes to the GenerateContractView to handle the request
    path('generate-contract/', GenerateContractView.as_view(), name='generate-contract'),

    # URL pattern for deleting a contract by its name
    # Routes to the DeleteContractView to handle the request
    path('delete-contract/<str:contract_name>/', DeleteContractView.as_view(), name='delete-contract'),

    # URL pattern for fetching user contracts
    # Routes to the FetchContractsView to handle the request
    path('get-user-contracts/', FetchContractsView.as_view(), name='get-user-contracts'),

    # URL pattern for getting a valid checksum address
    # Routes to the CheckSumAddressView to handle the request
    path('get-valid-checksum-address/<str:address>/', CheckSumAddressView.as_view(), name='get-valid-checksum-address'),
]