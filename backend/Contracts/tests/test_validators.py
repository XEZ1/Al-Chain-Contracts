from django.test import TestCase
from django.core.exceptions import ValidationError
from ..validators import validate_ethereum_address, validate_hexadecimal, validate_contract_name, validate_json_format


class TestValidators(TestCase):
    """
    Test case for the custom validators.
    Ensures that the validators work as expected and raise appropriate validation errors.
    """

    def test_validate_ethereum_address(self):
        """
        Test the validate_ethereum_address validator.

        This method checks that valid Ethereum addresses pass validation and invalid ones raise a ValidationError.
        """
        self.assertIsNone(validate_ethereum_address('0x52908400098527886E0F7030069857D2E4169EE7'))

        with self.assertRaises(ValidationError):
            validate_ethereum_address('0x1234')

        with self.assertRaises(ValidationError):
            validate_ethereum_address('0x52908400098527886e0f7030069857d2e4169ee7')

    def test_validate_hexadecimal(self):
        """
        Test the validate_hexadecimal validator.

        This method checks that valid hexadecimal values pass validation and invalid ones raise a ValidationError.
        """
        self.assertIsNone(validate_hexadecimal('0x1a2b3c'))

        with self.assertRaises(ValidationError):
            validate_hexadecimal('hello world!')

        with self.assertRaises(ValidationError):
            validate_hexadecimal('0xABCDEFGH')

    def test_validate_contract_name(self):
        """
        Test the validate_contract_name validator.

        This method checks that valid contract names pass validation and invalid ones raise a ValidationError.
        """
        self.assertIsNone(validate_contract_name('Valid Contract 1'))

        with self.assertRaises(ValidationError):
            validate_contract_name('AB')

        with self.assertRaises(ValidationError):
            validate_contract_name('ABC' * 50)

        with self.assertRaises(ValidationError):
            validate_contract_name('Invalid@Test.Name!?')

    def test_validate_json_format(self):
        """
        Test the validate_json_format validator.

        This method checks that valid JSON strings pass validation and invalid ones raise a ValidationError.
        """
        self.assertIsNone(validate_json_format('{"key": "value"}'))

        with self.assertRaises(ValidationError):
            validate_json_format('{key: "value"}')

        with self.assertRaises(ValidationError):
            validate_json_format('{"key": value}')

