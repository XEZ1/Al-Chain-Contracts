from web3 import Web3
import re
import json
from django.core.exceptions import ValidationError


def validate_ethereum_address(value):
    """
    Validate that the given value is a valid Ethereum address.

    This function checks if the provided value is a valid Ethereum address
    and if it is checksummed. Raises a ValidationError if the address is
    invalid or not checksummed.

    @param value: The Ethereum address to validate.
    @raise ValidationError: If the address is not valid or not checksummed.
    """
    if not Web3.is_address(value):
        raise ValidationError(f"{value} is not a valid Ethereum address.")
    if not Web3.is_checksum_address(value):
        raise ValidationError(f"{value} is not a checksummed address.")


def validate_hexadecimal(value):
    """
    Validate that the given value is a valid hexadecimal string.

    This function checks if the provided value matches the pattern of a
    hexadecimal string starting with '0x'. Raises a ValidationError if the
    value is not a valid hexadecimal.

    @param value: The hexadecimal value to validate.
    @raise ValidationError: If the value is not a valid hexadecimal string.
    """
    if not re.match(r'^0x[a-fA-F0-9]+$', value):
        raise ValidationError(f"{value} is not a valid hexadecimal value.")


def validate_contract_name(value):
    """
    Validate that the given contract name is valid.

    This function checks if the contract name is between 3 and 100 characters
    long and contains only letters, numbers, and spaces. Raises a ValidationError
    if the name does not meet these criteria.

    @param value: The contract name to validate.
    @raise ValidationError: If the contract name is invalid.
    """
    if len(value) < 3 or len(value) > 100:
        raise ValidationError("Contract name must be between 3 and 100 characters.")
    if not re.match(r'^[\w\s]+$', value):
        raise ValidationError("Contract name must only contain letters, numbers, and spaces.")


def validate_json_format(value):
    """
    Validate that the given value is a valid JSON string.

    This function attempts to load the provided value as JSON. Raises a ValidationError
    if the value is not a valid JSON string.

    @param value: The JSON string to validate.
    @raise ValidationError: If the value is not valid JSON.
    """
    try:
        json.loads(value)
    except ValueError as e:
        raise ValidationError("Contract content is not valid JSON.")
