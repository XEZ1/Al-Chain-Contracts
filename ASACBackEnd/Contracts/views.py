import os
from openai import OpenAI
from dotenv import load_dotenv
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from Notifications.models import NotificationPushToken
from Notifications.utils import send_push_notification
from .models import SmartContract
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import EmploymentContractSerialiser, SmartContractSerialiser
from rest_framework.permissions import IsAuthenticated
from web3 import Web3

# Load environment variables from .env file
load_dotenv()


class GenerateContractView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = EmploymentContractSerialiser(data=data)
        if serializer.is_valid():
            employment_contract = serializer.save(user=request.user)

            # Send text to OpenAI to generate Solidity code
            # solidity_code = self.generate_solidity_code(contract_text)
            solidity_code = """// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\nimport \"node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol\"; // Interface for ERC20 tokens\nimport \"node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol\"; // Prevent re-entrancy attacks\n\ncontract EmploymentContract is ReentrancyGuard {\n    address public employer; // employer's address to be set upon deployment\n    address public employee = 0xb38e8c17e38363af6ebdcb3dae12e0243582891d;\n    address private authorizedApp; // Address of the authorized app to update metrics\n    uint256 public salary = 7083; // Monthly salary amount in USDC\n    IERC20 private usdcToken; // USDC token contract interface\n    uint256 public startDate = 1718838000; // unix Thu Jun 20 2024 00:00:00 GMT+0100 (British Summer Time)\n    uint256 public terminationDate = 1750287600; // unix Thu Jun 19 2025 00:00:00 GMT+0100 (British Summer Time)\n    uint256 public lastSalaryPaidDate; // Tracks last salary payment date\n    uint256 public performanceScore = 0; // Performance score, updated by the authorized app\n    uint256 public performanceThreshold = 0; // Performance score, updated by the authorized app\n    bool public isEmployed = true; // Employment status\n    string public salaryType = 'monthly'; // How often a salary payment to be initiated\n    \n    event SalaryUpdated(uint256 newSalary);\n    event BonusPaid(uint256 bonusAmount);\n    event EmploymentTerminated(string message);\n    event DisputeResolved(string message);\n    event SalaryPaid(uint256 amount);\n    event PerformanceScoreUpdated(uint256 score);\n    event PerformanceThresholdUpdated(uint256 threshold);\n    event TerminationDateUpdated(uint256 newTerminationDate);\n\n    modifier onlyAuthorizedApp() {\n        require(msg.sender == authorizedApp, \"Caller is not the authorized app\");\n        _;\n    }\n\n    constructor(\n        address _authorizedApp,\n        address _usdcTokenAddress\n    ) {\n        employer = msg.sender; // The address deploying the contract is the employer\n        authorizedApp = _authorizedApp;\n        usdcToken = IERC20(_usdcTokenAddress);\n        lastSalaryPaidDate = startDate; // Initialize with start date\n    }\n\n    // Function to deposit USDC into the contract for salary payments\n    function depositSalaryFunds(uint256 _amount) external nonReentrant {\n        require(msg.sender == employer, \"Only the employer can deposit funds\");\n        usdcToken.transferFrom(msg.sender, address(this), _amount);\n    }\n\n    // Function to automatically withdraw monthly salary funds from the employer\n    function monthlyFunding() external onlyAuthorizedApp nonReentrant {\n        uint256 amountNeeded = salary * 3; // Ensure buffer for 3 months\n        uint256 currentBalance = usdcToken.balanceOf(address(this));\n        uint256 shortfall = 0;\n\n        if (currentBalance < amountNeeded) {\n            shortfall = amountNeeded - currentBalance;\n            // Attempt to transfer the shortfall from the employer to the contract\n            usdcToken.transferFrom(employer, address(this), shortfall);\n        }\n    }\n\n    // Automatically pay salary on a monthly basis\n    function autoPaySalary() external onlyAuthorizedApp nonReentrant {\n        require(isEmployed, \"Employment has ended\");\n        require(block.timestamp >= lastSalaryPaidDate + 30 days, \"Salary already paid for this month\");\n        require(usdcToken.balanceOf(address(this)) >= salary, \"Insufficient funds in contract\");\n        require(performanceScore >= performanceThreshold, \"Performance score does not meet the required threshold. Employee is underperforming\");\n        \n        lastSalaryPaidDate += 30 days; // Update last salary paid date to current month\n        usdcToken.transfer(employee, salary);\n        emit SalaryPaid(salary);\n    }\n\n    // Update performance score\n    function updatePerformanceScore(uint256 _newScore) external onlyAuthorizedApp {\n        performanceScore = _newScore;\n        emit PerformanceScoreUpdated(_newScore);\n    }\n\n    function updatePerformanceThreshold(uint256 _threshold) external onlyAuthorizedApp {\n        performanceThreshold = _threshold;\n        emit PerformanceThresholdUpdated(_threshold);\n    }\n\n    // Extend employment termination date\n    function extendTerminationDate(uint256 _newTerminationDate) external onlyAuthorizedApp {\n        require(_newTerminationDate > terminationDate, \"New date must be after current termination date\");\n        terminationDate = _newTerminationDate;\n        emit TerminationDateUpdated(_newTerminationDate);\n    }\n\n    // Update salary\n    function updateSalary(uint256 _newSalary) external onlyAuthorizedApp {\n        salary = _newSalary;\n        emit SalaryUpdated(_newSalary);\n    }\n\n    // Pay bonus\n    function payBonus(uint256 _bonusAmount) external onlyAuthorizedApp nonReentrant {\n        require(usdcToken.balanceOf(address(this)) >= _bonusAmount, \"Insufficient funds in contract\");\n        usdcToken.transfer(employee, _bonusAmount);\n        emit BonusPaid(_bonusAmount);\n    }\n\n    // Terminate employment with mutual agreement or trigger dispute resolution if disagreement\n    function terminateEmployment(bool employeePermission, bool employerPermission, bool employerFault) external onlyAuthorizedApp {\n        if (employeePermission && employerPermission) {\n            // If both parties agree, terminate employment and notify\n            isEmployed = false;\n            emit EmploymentTerminated(\"Employment terminated by mutual agreement.\");\n        } else {\n            // If there is no mutual agreement, determine who does not agree and resolve the dispute\n            _resolveDispute(employerFault);\n        }\n    }\n\n    // Function to check contract balance (for employer's view)\n    function checkContractBalance() external view returns (uint256) {\n        return usdcToken.balanceOf(address(this));\n    }\n\n    // Additional function to handle disputes and protect the salary buffer\n    function _resolveDispute(bool employerFault) internal {\n        uint256 contractBalance = usdcToken.balanceOf(address(this));\n        address recipient = employerFault ? employee : employer;\n        usdcToken.transfer(recipient, contractBalance);\n\n        isEmployed = false;\n\n        string memory resolutionMessage = employerFault \n            ? \"Employer at fault, funds transferred to employee.\" \n            : \"Employee at fault, funds transferred to employer.\";\n        emit DisputeResolved(resolutionMessage);\n        emit EmploymentTerminated(\"Employment terminated due to dispute resolution.\");\n    }\n\n    // External interface for dispute resolution, callable by authorized app\n    function resolveDispute(bool employerFault) external onlyAuthorizedApp {\n        _resolveDispute(employerFault);\n    }\n}\n"""

            # Save the generated Solidity code as a new SmartContract instance
            smart_contract = SmartContract.objects.create(
                user=request.user,
                legal_contract=employment_contract,
                code=solidity_code,
                contract_name=employment_contract.contract_name,
                employer_address=data['employer_address'],
                auth_app_address=data['auth_app_address'],
                token_contract_interface=data['token_contract_interface'],
            )

            notification_push_token = NotificationPushToken.objects.filter(user=data['user']).first()
            if notification_push_token:
                send_push_notification(notification_push_token.token, "Your Smart Contract Was Successfully Generated!",
                                       f"We've successfully generated {smart_contract.contract_name}.sol for you.")

            return JsonResponse({"solidity_code": smart_contract.code}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


class DeleteContractView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            # Attempt to retrieve the contract
            contract = SmartContract.objects.get(user=request.user,
                                                 contract_name=request.headers.get('X-Contract-Name'))
        except SmartContract.DoesNotExist:
            # If the contract does not exist or does not belong to the user, return a 404 response
            return JsonResponse({"error": "Smart contract not found."}, status=status.HTTP_404_NOT_FOUND)

        # If the contract exists and belongs to the requesting user, delete the contract
        contract.delete()

        # Return a successful response
        return JsonResponse({"message": "Smart contract deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class FetchContractsView(APIView):

    def get(self, request, *args, **kwargs):
        user_contracts = SmartContract.objects.filter(user=request.user)
        serializer = SmartContractSerialiser(user_contracts, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)


class CheckSumAddressView(APIView):

    def get(self, request, *args, **kwargs):
        address = request.headers.get('X-Token-Address')
        if not address:
            return JsonResponse({"error": "Address header parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            valid_address = Web3.to_checksum_address(address)
            print(f"address: {valid_address}")
            return JsonResponse({"address": valid_address}, status=status.HTTP_200_OK)
        except ValueError:
            return JsonResponse({"error": "Invalid Ethereum address provided."}, status=status.HTTP_400_BAD_REQUEST)
