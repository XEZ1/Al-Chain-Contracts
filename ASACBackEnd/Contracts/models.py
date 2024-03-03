from django.db import models
from Accounts.models import User


class EmploymentContract(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='smart_contracts')
    contract_name = models.CharField(max_length=255)
    employer_address = models.CharField(max_length=42)
    auth_app_address = models.CharField(max_length=42)
    token_contract_interface = models.TextField()
    contract_file = models.FileField(upload_to='contracts/')

    def __str__(self):
        return self.contract_name


class SmartContract(models.Model):
    SALARY_TYPE_CHOICES = [
        ('monthly', 'Monthly'),
        ('bi-weekly', 'Bi-Weekly'),
        ('weekly', 'Weekly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='smart_contracts')
    legal_contract = models.ForeignKey(EmploymentContract, on_delete=models.CASCADE, related_name='smart_contracts')
    code = models.TextField()
    employer_usdc_address = models.CharField(max_length=42)
    employee_usdc_address = models.CharField(max_length=42)
    authorized_app_usdc_address = models.CharField(max_length=42)
    monthly_salary = models.DecimalField(max_digits=20, decimal_places=5)
    usdc_token_contract_interface = models.TextField()
    start_date = models.BigIntegerField()
    termination_date = models.BigIntegerField()
    performance_score = models.IntegerField()
    performance_threshold = models.IntegerField()
    is_employed = models.BooleanField(default=True)
    salary_type = models.CharField(max_length=10, choices=SALARY_TYPE_CHOICES)

    def __str__(self):
        return f"Smart Contract {self.id} - {self.employer_usdc_address} to {self.employee_usdc_address}"
