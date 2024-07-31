from rest_framework import serializers as serialisers
from .models import SmartContract, EmploymentContract


class EmploymentContractSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = EmploymentContract
        fields = '__all__'

    def create(self, validated_data):
        employment_contract = EmploymentContract.objects.create(**validated_data)
        return employment_contract


class SmartContractSerialiser(serialisers.ModelSerializer):
    legal_contract = serialisers.PrimaryKeyRelatedField(queryset=EmploymentContract.objects.all())

    class Meta:
        model = SmartContract
        fields = '__all__'

    def create(self, validated_data):
        smart_contract = SmartContract.objects.create(**validated_data)
        return smart_contract
