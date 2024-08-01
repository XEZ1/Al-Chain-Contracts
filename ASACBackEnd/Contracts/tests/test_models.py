from django.test import TestCase
from django.core.exceptions import ValidationError
from Accounts.models import User
from ..models import EmploymentContract, SmartContract
from django.db.utils import IntegrityError


class TestContractsModels(TestCase):
    """
    Test case for the EmploymentContract and SmartContract models.
    Ensures that the models behave as expected, including creation, validation, and constraints.
    """

    @classmethod
    def setUpTestData(self):
        """
        Set up the test data.

        This method creates a test user, an employment contract, and a smart contract for use in the tests.
        """
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

    def test_employment_contract_creation(self):
        """
        Test the creation of an EmploymentContract instance.

        This method checks that the employment contract is correctly created and its attributes are as expected.
        """
        self.assertIsInstance(self.employment_contract, EmploymentContract)
        self.assertEqual(self.employment_contract.user, self.user)
        self.assertEqual(self.employment_contract.contract_name, "Test Employment Contract")

    def test_smart_contract_creation(self):
        """
        Test the creation of a SmartContract instance.

        This method checks that the smart contract is correctly created and its attributes are as expected.
        """
        self.assertIsInstance(self.smart_contract, SmartContract)
        self.assertEqual(self.smart_contract.legal_contract, self.employment_contract)
        self.assertEqual(self.smart_contract.contract_name, "Test Smart Contract")

    def test_employment_contract_unique_together_constraints(self):
        """
        Test the unique together constraints of the EmploymentContract model.

        This method attempts to create a duplicate employment contract and checks if it raises an IntegrityError.
        """
        with self.assertRaises(IntegrityError):
            EmploymentContract.objects.create(
                user=self.user,
                contract_name="Test Employment Contract",
                employer_address="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
                auth_app_address="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
                token_contract_interface="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
                contract_content="This is another test employment-contract."
            )

    def test_smart_contract_unique_together_constraints(self):
        """
        Test the unique together constraints of the SmartContract model.

        This method attempts to create a duplicate smart contract and checks if it raises an IntegrityError.
        """
        with self.assertRaises(IntegrityError):
            SmartContract.objects.create(
                user=self.user,
                legal_contract=self.employment_contract,
                code="function test() { return true; }",
                contract_name="Test Smart Contract",
                employer_address="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
                auth_app_address="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
                token_contract_interface="0xC2D7CF95645D33006175B78989035C7c9061d3F8",
            )

    def test_model_string_representation(self):
        """
        Test the string representation of the models.

        This method checks that the string representation of the EmploymentContract and SmartContract models are as expected.
        """
        self.assertEqual(str(self.employment_contract),
                         f"Legal Employment Contract {self.employment_contract.id} - {self.employment_contract.contract_name}")
        self.assertEqual(str(self.smart_contract),
                         f"Smart Contract {self.smart_contract.id} - {self.smart_contract.contract_name}")

