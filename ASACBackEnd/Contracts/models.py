from django.db import models
from Accounts.models import User


class EmploymentContract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contract_name = models.CharField(max_length=255)
    employer_address = models.CharField(max_length=42)
    auth_app_address = models.CharField(max_length=42)
    token_contract_interface = models.TextField()
    contract_content = models.TextField()

    def __str__(self):
        return f"Legal Employment Contract {self.id} - {self.contract_name}"


class SmartContract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    legal_contract = models.ForeignKey(EmploymentContract, on_delete=models.CASCADE, related_name='smart_contracts')
    code = models.TextField()
    contract_name = models.CharField(max_length=255)
    employer_address = models.CharField(max_length=42)
    auth_app_address = models.CharField(max_length=42)
    token_contract_interface = models.TextField()

    def __str__(self):
        return f"Smart Contract {self.id} - {self.contract_name}"
