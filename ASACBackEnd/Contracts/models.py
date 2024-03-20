from django.db import models
from Accounts.models import User
from django_ethereum.fields import EthereumAddressField
from .validators import (validate_ethereum_address, validate_hexadecimal,
                         validate_contract_name, validate_json_format)


class EmploymentContract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contract_name = models.CharField(max_length=255, validators=[validate_contract_name])
    employer_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    auth_app_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    token_contract_interface = models.TextField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    contract_content = models.TextField()

    class Meta:
        unique_together = ('user', 'contract_name',)
        
    def __str__(self):
        return f"Legal Employment Contract {self.id} - {self.contract_name}"


class SmartContract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    legal_contract = models.ForeignKey(EmploymentContract, on_delete=models.CASCADE, related_name='smart_contracts')
    code = models.TextField()
    contract_name = models.CharField(max_length=255, validators=[validate_contract_name])
    employer_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    auth_app_address = models.CharField(max_length=42, validators=[validate_ethereum_address, validate_hexadecimal])
    token_contract_interface = models.TextField(validators=[validate_ethereum_address, validate_hexadecimal])

    class Meta:
        unique_together = ('user', 'contract_name',)

    def __str__(self):
        return f"Smart Contract {self.id} - {self.contract_name}"
