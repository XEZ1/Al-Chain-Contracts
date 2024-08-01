import json
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from Accounts.models import User
from Notifications.models import NotificationPushToken
from ..models import EmploymentContract, SmartContract
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
from ..views import GenerateContractView


class ViewTestCase(TestCase):
    """
    Base test case for setting up the test environment.
    Creates a user, employment contract, and smart contract for use in the tests.
    """

    def setUp(self):
        """
        Set up the test environment.

        This method creates a test user, an employment contract, and a smart contract.
        It also authenticates the test client with the created user.
        """
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.contract_details = {
            "employer_address": "0x99c805735C466c9B94762604612cfC961a48Eb03",
            "auth_app_address": "0x99c805735C466c9B94762604612cfC961a48Eb03",
            "token_contract_interface": "0x99c805735C466c9B94762604612cfC961a48Eb03",
        }
        self.employment_contract = EmploymentContract.objects.create(
            user=self.user,
            contract_name="Test Employment Contract",
            contract_content="Sample contract content",
            **self.contract_details
        )
        self.smart_contract = SmartContract.objects.create(
            user=self.user,
            legal_contract=self.employment_contract,
            code="function test() { return true; }",
            contract_name="Test Smart Contract",
            **self.contract_details
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.maxDiff = None


class TestGenerateContractView(ViewTestCase):
    """
    Test case for the GenerateContractView.
    Ensures that contract generation works correctly, including handling notifications.
    """

    @patch('Contracts.views.send_push_notification')
    @patch('Contracts.views.GenerateContractView.generate_solidity_code')
    def test_post_successful_contract_generation_with_notification(self, mock_generate_solidity_code, mock_send_notification):
        """
        Test successful contract generation with notification.

        This method mocks the Solidity code generation and notification sending.
        It checks if a new contract is created and if the notification is sent correctly.
        """
        mock_generate_solidity_code.return_value = "test solidity code"

        NotificationPushToken.objects.create(user=self.user, token='ExponentPushToken[dummy-token]')

        url = reverse('generate-contract')
        data = self.contract_details.copy()
        data.update({"contract_name": "New Test Contract", "contract_content": "This is a new test contract content"})

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        mock_send_notification.assert_called_once()
        mock_send_notification.assert_called_with(
            'ExponentPushToken[dummy-token]',
            "Your Smart Contract Was Successfully Generated!",
            f"We've successfully generated {data['contract_name']}.sol for you."
        )

        self.assertTrue(SmartContract.objects.filter(contract_name="New Test Contract").exists())
        self.assertTrue(NotificationPushToken.objects.filter(user=self.user).exists())

    @patch('Contracts.views.GenerateContractView.generate_solidity_code')
    def test_post_successful_contract_generation_without_notification(self, mock_generate_solidity_code):
        """
        Test successful contract generation without notification.

        This method mocks the Solidity code generation.
        It checks if a new contract is created when no notification push token is present.
        """
        mock_generate_solidity_code.return_value = "test solidity code"

        url = reverse('generate-contract')
        data = self.contract_details.copy()
        data.update({"contract_name": "New Test Contract", "contract_content": "This is a new test contract content"})

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(SmartContract.objects.filter(contract_name="New Test Contract").exists())
        self.assertFalse(NotificationPushToken.objects.filter(user=self.user).exists())

    def test_post_failure_contract_generation(self):
        """
        Test failure of contract generation due to missing data.

        This method checks that an error is returned when no data is provided.
        """
        url = reverse('generate-contract')
        response = self.client.post(url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_data_contract_generation(self):
        """
        Test failure of contract generation due to invalid data.

        This method checks that an error is returned when invalid data is provided.
        """
        url = reverse('generate-contract')
        data = self.contract_details.copy()
        data.update({"contract_name": ""})

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response_data = json.loads(response.content)
        self.assertTrue('contract_name' in response_data and
                        'This field may not be blank.' in response_data['contract_name'])
        # self.assertIn('error', response_data)

    @patch('Contracts.views.OpenAI')
    def test_generate_solidity_code(self, mock_openai_class):
        """
        Test the generate_solidity_code method.

        This method mocks the OpenAI API call and checks if the Solidity code generation works correctly.
        """
        mock_response = MagicMock()
        mock_response.choices = [MagicMock(message=MagicMock(content='simulated solidity code'))]
        mock_chat = MagicMock()
        mock_chat.completions.create.return_value = mock_response
        mock_openai_instance = MagicMock(chat=mock_chat)
        mock_openai_class.return_value = mock_openai_instance

        view = GenerateContractView()

        contract_text = "Test content"
        result = view.generate_solidity_code(contract_text)

        self.assertEqual(result, 'simulated solidity code')
        mock_chat.completions.create.assert_called_once_with(
            messages=[{"role": "user",
                       "content": f"Convert the following legal employment contract into a Solidity smart contract. "
                                  f"You shall pass back only code! Here is the contract: {contract_text}"}],
            model="ft:gpt-3.5-turbo-0125:personal:asac:8yTaZJJl"
        )

    def test_generate_fake_solidity_code(self):
        """
        Test the generate_fake_solidity_code method.

        This method checks if the fake Solidity code generation method returns a string.
        """
        view = GenerateContractView()
        result = view.generate_fake_solidity_code_for_testing()
        self.assertEqual(type(result), str)


class TestDeleteContractView(ViewTestCase):
    """
    Test case for the DeleteContractView.
    Ensures that contract deletion works correctly.
    """

    def test_delete_successful_contract_deletion(self):
        """
        Test successful contract deletion.

        This method checks that a contract is deleted when it exists and belongs to the user.
        """
        url = reverse('delete-contract', kwargs={'contract_name': self.smart_contract.contract_name})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SmartContract.objects.filter(id=self.smart_contract.id).exists())

    def test_delete_failure_contract_deletion(self):
        """
        Test failure of contract deletion due to non-existent contract.

        This method checks that an error is returned when the contract does not exist.
        """
        url = reverse('delete-contract', kwargs={'contract_name': 'nonexistent_contract'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestFetchContractsView(ViewTestCase):
    """
    Test case for the FetchContractsView.
    Ensures that fetching contracts works correctly.
    """

    def test_get_successful_contract_fetch(self):
        """
        Test successful fetching of contracts.

        This method checks that the user's contracts are fetched correctly.
        """
        url = reverse('get-user-contracts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)

    def test_get_empty_contract_fetch(self):
        """
        Test fetching contracts when no contracts exist.

        This method checks that an empty list is returned when the user has no contracts.
        """
        url = reverse('get-user-contracts')
        self.smart_contract.delete()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)


class TestCheckSumAddressView(ViewTestCase):
    """
    Test case for the CheckSumAddressView.
    Ensures that Ethereum address checksumming works correctly.
    """

    def test_post_successful_checksum_address(self):
        """
        Test successful Ethereum address checksumming.

        This method checks that a valid Ethereum address is correctly checksummed.
        """
        url = reverse('get-valid-checksum-address', args=['0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_failure_checksum_address(self):
        """
        Test failure to checksum an invalid Ethereum address.

        This method verifies that an appropriate error is returned for an invalid Ethereum address
        """
        url = reverse('get-valid-checksum-address', args=['0xInvalid'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_missing_token_address_header(self):
    #     url = reverse('get-valid-checksum-address')
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #
    #     response_data = json.loads(response.content)
    #     self.assertIn('error', response_data)
