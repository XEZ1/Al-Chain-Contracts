from django.test import TestCase
from rest_framework.test import APIClient
from ..models import SmartContract, EmploymentContract
from Accounts.models import User
from ..serialisers import SmartContractSerialiser, EmploymentContractSerialiser


class TestSerialisers(TestCase):
    """
    Test case for the EmploymentContract and SmartContract serialisers.
    Ensures that serialisation and deserialisation processes work correctly.
    """

    def setUp(self):
        """
        Set up the test environment.

        This method creates a test user, an employment contract, and a smart contract for use in the tests.
        """
        self.client = APIClient()
        self.user = User.objects.create(
            username='testuser',
            first_name='test',
            last_name='user',
            email='testuser@kcl.ac.uk',
            password='123456789A!'
        )
        self.employment_contract = EmploymentContract.objects.create(
            user=self.user,
            contract_name="Test Employment Contract",
            employer_address="0x99c805735C466c9B94762604612cfC961a48Eb03",
            auth_app_address="0x99c805735C466c9B94762604612cfC961a48Eb03",
            token_contract_interface="0x99c805735C466c9B94762604612cfC961a48Eb03",
            contract_content="Sample contract content"
        )

        self.smart_contract = SmartContract.objects.create(
            user=self.user,
            legal_contract=self.employment_contract,
            code="function test() { return true; }",
            contract_name="Test Smart Contract",
            employer_address="0x99c805735C466c9B94762604612cfC961a48Eb03",
            auth_app_address="0x99c805735C466c9B94762604612cfC961a48Eb03",
            token_contract_interface="0x99c805735C466c9B94762604612cfC961a48Eb03"
        )

    def test_employment_contract_serialiser(self):
        """
        Test the EmploymentContract serialiser.

        This method checks if the EmploymentContract serialiser correctly serialises an instance
        and deserialises data to create a new EmploymentContract instance.
        """
        serialiser = EmploymentContractSerialiser(instance=self.employment_contract)
        data = serialiser.data
        self.assertEqual(set(data.keys()), {'id', 'user', 'contract_name', 'employer_address', 'auth_app_address',
                                            'token_contract_interface', 'contract_content'})

        # Deserialise and create new instance
        new_data = {
            'user': self.user.id,
            'contract_name': 'New Sample Contract',
            'employer_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'auth_app_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'token_contract_interface': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'contract_content': 'New test content here'
        }
        serialiser = EmploymentContractSerialiser(data=new_data)
        self.assertTrue(serialiser.is_valid())
        new_contract = serialiser.save()
        self.assertEqual(new_contract.contract_name, 'New Sample Contract')

    def test_smart_contract_serialiser(self):
        """
        Test the SmartContract serialiser.

        This method checks if the SmartContract serialiser correctly serialises an instance
        and deserialises data to create a new SmartContract instance.
        """
        serialiser = SmartContractSerialiser(instance=self.smart_contract)
        data = serialiser.data
        self.assertEqual(set(data.keys()), {'id', 'user', 'legal_contract', 'code', 'contract_name', 'employer_address',
                                            'auth_app_address', 'token_contract_interface'})

        # Deserialise and create new instance
        new_data = {
            'user': self.user.id,
            'legal_contract': self.employment_contract.id,
            'code': 'New Sample Code',
            'contract_name': 'New Smart Contract',
            'employer_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'auth_app_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'token_contract_interface': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3'
        }
        serialiser = SmartContractSerialiser(data=new_data)
        self.assertTrue(serialiser.is_valid())
        new_smart_contract = serialiser.save()
        self.assertEqual(new_smart_contract.code, 'New Sample Code')