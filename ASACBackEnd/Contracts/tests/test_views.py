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

    def setUp(self):
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

    @patch('Contracts.views.send_push_notification')
    def test_post_successful_contract_generation_with_notification(self, mock_send_notification):
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

    def test_post_successful_contract_generation_without_notification(self):
        url = reverse('generate-contract')
        data = self.contract_details.copy()
        data.update({"contract_name": "New Test Contract", "contract_content": "This is a new test contract content"})

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(SmartContract.objects.filter(contract_name="New Test Contract").exists())
        self.assertFalse(NotificationPushToken.objects.filter(user=self.user).exists())

    def test_post_failure_contract_generation(self):
        url = reverse('generate-contract')
        response = self.client.post(url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_data_contract_generation(self):
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
        view = GenerateContractView()
        result = view.generate_fake_solidity_code_for_testing()
        self.assertEqual(type(result), str)


class TestDeleteContractView(ViewTestCase):
    def test_delete_successful_contract_deletion(self):
        url = reverse('delete-contract', kwargs={'contract_name': self.smart_contract.contract_name})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SmartContract.objects.filter(id=self.smart_contract.id).exists())

    def test_delete_failure_contract_deletion(self):
        url = reverse('delete-contract', kwargs={'contract_name': 'nonexistent_contract'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestFetchContractsView(ViewTestCase):
    def test_get_successful_contract_fetch(self):
        url = reverse('get-user-contracts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)

    def test_get_empty_contract_fetch(self):
        url = reverse('get-user-contracts')
        self.smart_contract.delete()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data), 0)


class TestCheckSumAddressView(ViewTestCase):
    def test_post_successful_checksum_address(self):
        url = reverse('get-valid-checksum-address')
        response = self.client.get(url, HTTP_X_TOKEN_ADDRESS='0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_failure_checksum_address(self):
        url = reverse('get-valid-checksum-address')
        response = self.client.get(url, HTTP_X_TOKEN_ADDRESS='0xInvalid')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_token_address_header(self):
        url = reverse('get-valid-checksum-address')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response_data = json.loads(response.content)
        self.assertIn('error', response_data)
