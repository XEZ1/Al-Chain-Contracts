from rest_framework import serializers as serialisers
from .models import SmartContract, EmploymentContract


class EmploymentContractSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the EmploymentContract model.
    Converts EmploymentContract instances to and from JSON format.
    """
    class Meta:
        """
        Meta options for the EmploymentContractSerialiser.
        Specifies the model and fields to be included in the serialisation.
        """
        model = EmploymentContract
        fields = '__all__'

    def create(self, validated_data):
        """
        Create a new EmploymentContract instance with the validated data.

        @param validated_data: The validated data for the new EmploymentContract.
        @return: The created EmploymentContract instance.
        """
        employment_contract = EmploymentContract.objects.create(**validated_data)
        return employment_contract


class SmartContractSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the SmartContract model.
    Converts SmartContract instances to and from JSON format.
    Includes a reference to an EmploymentContract.
    """
    legal_contract = serialisers.PrimaryKeyRelatedField(queryset=EmploymentContract.objects.all())

    class Meta:
        """
        Meta options for the SmartContractSerialiser.
        Specifies the model and fields to be included in the serialisation.
        """
        model = SmartContract
        fields = '__all__'

    def create(self, validated_data):
        """
        Create a new SmartContract instance with the validated data.

        @param validated_data: The validated data for the new SmartContract.
        @return: The created SmartContract instance.
            """
        smart_contract = SmartContract.objects.create(**validated_data)
        return smart_contract
