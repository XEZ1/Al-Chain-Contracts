from django.test import TestCase
from rest_framework.test import APIClient
from ..models import SmartContract, EmploymentContract
from Accounts.models import User
from ..serializers import SmartContractSerialiser, EmploymentContractSerialiser


class TestSerialisers(TestCase):

    def setUp(self):
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

    def test_employment_contract_serializer(self):
        serialiser = EmploymentContractSerialiser(instance=self.employment_contract)
        data = serialiser.data
        self.assertEqual(set(data.keys()), {'id', 'user', 'contract_name', 'employer_address', 'auth_app_address',
                                            'token_contract_interface', 'contract_content'})

        # Deserialize and create new instance
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

    def test_smart_contract_serializer(self):
        serialiser = SmartContractSerialiser(instance=self.smart_contract)
        data = serialiser.data
        self.assertEqual(set(data.keys()), {'id', 'user', 'legal_contract', 'code', 'contract_name', 'employer_address',
                                            'auth_app_address', 'token_contract_interface'})

        # Deserialize and create new instance
        new_data = {
            'user': self.user.id,
            'legal_contract': self.employment_contract.id,
            'code': 'New Sample Code',
            'contract_name': 'New Smart Contract',
            'employer_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'auth_app_address': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3',
            'token_contract_interface': '0x618dd342BcbF099cBa4d200CBdadfbd2c94258F3'
        }
        serializer = SmartContractSerialiser(data=new_data)
        self.assertTrue(serializer.is_valid())
        new_smart_contract = serializer.save()
        self.assertEqual(new_smart_contract.code, 'New Sample Code')