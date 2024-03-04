import os
import docx
import fitz
from openai import OpenAI
from dotenv import load_dotenv
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import EmploymentContract, SmartContract
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import EmploymentContractSerialiser, SmartContractSerialiser

# Load environment variables from .env file
load_dotenv()


class ContractView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = EmploymentContractSerialiser(data=request.data)
        if serializer.is_valid():
            employment_contract = serializer.save(user=request.user)

            # Extract text from the uploaded file
            contract_text = self.extract_text_from_file(employment_contract.contract_file)

            # Send text to OpenAI to generate Solidity code
            solidity_code = self.generate_solidity_code(contract_text)

            # Save the generated Solidity code as a new SmartContract instance
            smart_contract = SmartContract.objects.create(
                user=request.user,
                legal_contract=employment_contract,
                code=solidity_code,
                # Populate other necessary fields as needed
            )

            # Extend for saving Solidity code to a .sol file

            return JsonResponse({"solidity_code": solidity_code}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def extract_text_from_file(self, contract_file):
        if contract_file.name.endswith('.docx'):
            return self.extract_text_from_docx(contract_file)
        elif contract_file.name.endswith('.pdf'):
            return self.extract_text_from_pdf(contract_file)
        elif contract_file.name.endswith('.txt'):
            return contract_file.read().decode('utf-8')
        else:
            return None

    def extract_text_from_docx(self, docx_file):
        doc = docx.Document(docx_file)
        full_text = [para.text for para in doc.paragraphs]
        return '\n'.join(full_text)

    def extract_text_from_pdf(self, pdf_file):
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    def generate_solidity_code(self, contract_text):
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        prompt = (f"Convert the following legal employment contract into a Solidity smart contract. You shall pass "
                  f"back only code! Here is the contract: {contract_text}")
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt},
            ],
            model="ft:gpt-3.5-turbo-0125:personal:asac:8yTaZJJl",
        )
        content = chat_completion.choices[0].message.content
        return content