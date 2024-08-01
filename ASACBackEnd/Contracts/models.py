from django.db import models
from Accounts.models import User
from .validators import (validate_ethereum_address, validate_hexadecimal,
                         validate_contract_name, validate_json_format)


class EmploymentContract(models.Model):
    """
    Model representing an employment contract.
    Contains information about the user, contract details, and Ethereum addresses.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contract_name = models.CharField(max_length=255, validators=[validate_contract_name])
    employer_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    auth_app_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    token_contract_interface = models.TextField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    contract_content = models.TextField()

    class Meta:
        """
        Meta options for the EmploymentContract model.
        Ensures that each user has unique contract names.
        """
        unique_together = ('user', 'contract_name',)
        
    def __str__(self):
        """
        String representation of the EmploymentContract model.
        Provides a human-readable representation of the contract.
        @return: A string representation of the EmploymentContract model.
        """
        return f"Legal Employment Contract {self.id} - {self.contract_name}"


class SmartContract(models.Model):
    """
    Model representing a smart contract.
    Linked to an EmploymentContract and contains the smart contract code and Ethereum addresses.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    legal_contract = models.ForeignKey(EmploymentContract, on_delete=models.CASCADE, related_name='smart_contracts')
    code = models.TextField()
    contract_name = models.CharField(max_length=255, validators=[validate_contract_name])
    employer_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    auth_app_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    token_contract_interface = models.TextField(validators=[validate_ethereum_address, validate_hexadecimal])

    class Meta:
        """
        Meta options for the SmartContract model.
        Ensures that each user has unique contract names.
        """
        unique_together = ('user', 'contract_name',)

    def __str__(self):
        """
        String representation of the SmartContract model.
        Provides a human-readable representation of the smart contract.
        """
        return f"Smart Contract {self.id} - {self.contract_name}"
