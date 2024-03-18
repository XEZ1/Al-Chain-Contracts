from web3 import Web3
import re
import json
from django.core.exceptions import ValidationError

def validate_ethereum_address(value):
    if not Web3.isAddress(value):
        raise ValidationError(f"{value} is not a valid Ethereum address.")
    if not Web3.isChecksumAddress(value):
        raise ValidationError(f"{value} is not a checksummed address.")

def validate_hexadecimal(value):
    if not re.match(r'^0x[a-fA-F0-9]+$', value):
        raise ValidationError(f"{value} is not a valid hexadecimal value.")

def validate_contract_name(value):
    if len(value) < 3 or len(value) > 100:
        raise ValidationError("Contract name must be between 3 and 100 characters.")
    if not re.match(r'^[\w\s]+$', value):
        raise ValidationError("Contract name must only contain letters, numbers, and spaces.")

def validate_json_format(value):
    try:
        json.loads(value)
    except ValueError as e:
        raise ValidationError("Contract content is not valid JSON.")
