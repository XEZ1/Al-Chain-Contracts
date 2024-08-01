from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *


class TestUrls(SimpleTestCase):
    """
    Test case for URL routing.
    Ensures that the URLs resolve to the correct views.
    """
    def test_generate_contract_url_resolves(self):
        """
        Test that the generate contract URL resolves correctly.

        This method checks that the URL for generating a contract resolves to the GenerateContractView.
        """
        url = reverse('generate-contract')
        self.assertEqual(resolve(url).func.view_class, GenerateContractView)

    def test_delete_contract_url_resolves(self):
        """
        Test that the delete contract URL resolves correctly.

        This method checks that the URL for deleting a contract resolves to the DeleteContractView.
        """
        url = reverse('delete-contract', kwargs={'contract_name': 'nonexistent_contract'})
        self.assertEqual(resolve(url).func.view_class, DeleteContractView)

    def test_fetch_contracts_url_resolves(self):
        """
        Test that the fetch contracts URL resolves correctly.

        This method checks that the URL for fetching user contracts resolves to the FetchContractsView.
        """
        url = reverse('get-user-contracts')
        self.assertEqual(resolve(url).func.view_class, FetchContractsView)

    def test_checksum_address_url_resolves(self):
        """
        Test that the checksum address URL resolves correctly.

        This method checks that the URL for getting a valid checksum address resolves to the CheckSumAddressView.
        """
        url = reverse('get-valid-checksum-address', kwargs={'address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3'})
        self.assertEqual(resolve(url).func.view_class, CheckSumAddressView)
