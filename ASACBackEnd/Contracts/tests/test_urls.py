from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    def test_generate_contract_url_resolves(self):
        url = reverse('generate-contract')
        self.assertEqual(resolve(url).func.view_class, GenerateContractView)

    def test_delete_contract_url_resolves(self):
        url = reverse('delete-contract', kwargs={'contract_name': 'nonexistent_contract'})
        self.assertEqual(resolve(url).func.view_class, DeleteContractView)

    def test_fetch_contracts_url_resolves(self):
        url = reverse('get-user-contracts')
        self.assertEqual(resolve(url).func.view_class, FetchContractsView)

    def test_checksum_address_url_resolves(self):
        url = reverse('get-valid-checksum-address')
        self.assertEqual(resolve(url).func.view_class, CheckSumAddressView)
