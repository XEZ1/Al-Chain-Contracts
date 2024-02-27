// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Interface for ERC20 tokens
import "node_modules/@openzeppelin/contracts/utils/ReentrancyGuard.sol"; // Prevent re-entrancy attacks

contract EmploymentContract is ReentrancyGuard {
    address public employer;
    address public employee;
    address private authorizedApp; // Address of the authorized app to update metrics
    uint256 public salary; // Monthly salary amount in USDC
    IERC20 private usdcToken; // USDC token contract interface
    uint256 public startDate;
    uint256 public terminationDate;
    uint256 public lastSalaryPaidDate; // Tracks last salary payment date
    uint256 public performanceScore; // Performance score, updated by the authorized app
    bool public isEmployed = true; // Employment status

    event SalaryUpdated(uint256 newSalary);
    event BonusPaid(uint256 bonusAmount);
    event EmploymentTerminated(string message);
    event DisputeResolved(string message);
    event SalaryPaid(uint256 amount);

    modifier onlyAuthorizedApp() {
        require(msg.sender == authorizedApp, "Caller is not the authorized app");
        _;
    }

    constructor(
        address _employee,
        address _authorizedApp,
        uint256 _salary,
        address _usdcTokenAddress,
        uint256 _startDate,
        uint256 _terminationDate
    ) {
        employer = msg.sender; // The address deploying the contract is the employer
        employee = _employee;
        authorizedApp = _authorizedApp;
        salary = _salary;
        usdcToken = IERC20(_usdcTokenAddress);
        startDate = _startDate;
        terminationDate = _terminationDate;
        lastSalaryPaidDate = _startDate; // Initialize with start date
    }

    // Function to deposit USDC into the contract for salary payments
    function depositSalaryFunds(uint256 _amount) external nonReentrant {
        require(msg.sender == employer, "Only the employer can deposit funds");
        usdcToken.transferFrom(msg.sender, address(this), _amount);
    }

    // Function to automatically withdraw monthly salary funds from the employer
    function monthlyFunding() external onlyAuthorizedApp nonReentrant {
        uint256 amountNeeded = salary * 3; // Ensure buffer for 3 months
        uint256 currentBalance = usdcToken.balanceOf(address(this));
        uint256 shortfall = 0;

        if (currentBalance < amountNeeded) {
            shortfall = amountNeeded - currentBalance;
            // Attempt to transfer the shortfall from the employer to the contract
            usdcToken.transferFrom(employer, address(this), shortfall);
        }
    }

    // Automatically pay salary on a monthly basis
    function autoPaySalary() external onlyAuthorizedApp nonReentrant {
        require(isEmployed, "Employment has ended");
        require(block.timestamp >= lastSalaryPaidDate + 30 days, "Salary already paid for this month");
        require(usdcToken.balanceOf(address(this)) >= salary, "Insufficient funds in contract");

        lastSalaryPaidDate += 30 days; // Update last salary paid date to current month
        usdcToken.transfer(employee, salary);
        emit SalaryPaid(salary);
    }

    // Update performance score
    function updatePerformanceScore(uint256 _newScore) external onlyAuthorizedApp {
        performanceScore = _newScore;
    }

    // Extend employment termination date
    function extendTerminationDate(uint256 _newTerminationDate) external onlyAuthorizedApp {
        require(_newTerminationDate > terminationDate, "New date must be after current termination date");
        terminationDate = _newTerminationDate;
    }

    // Update salary
    function updateSalary(uint256 _newSalary) external onlyAuthorizedApp {
        salary = _newSalary;
        emit SalaryUpdated(_newSalary);
    }

    // Pay bonus
    function payBonus(uint256 _bonusAmount) external onlyAuthorizedApp nonReentrant {
        require(usdcToken.balanceOf(address(this)) >= _bonusAmount, "Insufficient funds in contract");
        usdcToken.transfer(employee, _bonusAmount);
        emit BonusPaid(_bonusAmount);
    }

    // Terminate employment with mutual agreement or trigger dispute resolution if disagreement
    function terminateEmployment(bool employeePermission, bool employerPermission, bool employerFault) external onlyAuthorizedApp {
        if (employeePermission && employerPermission) {
            // If both parties agree, terminate employment and notify
            isEmployed = false;
            emit EmploymentTerminated("Employment terminated by mutual agreement.");
        } else {
            // If there is no mutual agreement, determine who does not agree and resolve the dispute
            _resolveDispute(employerFault);
        }
    }

    // Function to check contract balance (for employer's view)
    function checkContractBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    // Additional function to handle disputes and protect the salary buffer
    function _resolveDispute(bool employerFault) internal {
        uint256 contractBalance = usdcToken.balanceOf(address(this));
        address recipient = employerFault ? employee : employer;
        usdcToken.transfer(recipient, contractBalance);

        isEmployed = false;

        string memory resolutionMessage = employerFault 
            ? "Employer at fault, funds transferred to employee." 
            : "Employee at fault, funds transferred to employer.";
        emit DisputeResolved(resolutionMessage);
        emit EmploymentTerminated("Employment terminated due to dispute resolution.");
    }

    // External interface for dispute resolution, callable by authorized app
    function resolveDispute(bool employerFault) external onlyAuthorizedApp {
        _resolveDispute(employerFault);
    }
}
