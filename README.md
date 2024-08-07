# AIChain Contracts

## Project Description

AI-Chain-Contracts is a platform developed in collaboration with IBM as a dissertation project at King's College London. It is experimental software designed to leverage Generative AI and smart contract technology to automate and secure employment interactions.

## Software Description

AI-Chain-Contracts uses a fine-tuned model of OpenAI's GPT-3.5 Turbo to convert traditional legal employment contracts into smart ones. The backend is built using the Django Rest Framework, providing a robust environment for handling data processing and interactions with the AI model. The user interface is developed with React Native for both iOS and Android devices.

## Key Features

- **Contract Conversion:** Automatically transforms traditional employment contracts into smart contracts using AI.
- **User Authentication:** Secure account creation and management for both employers and employees.
- **Contract Management:** Allows users to create, view, update, and delete smart contracts.
- **Salary Management:** Facilitates salary payments using USDC Coin.
- **Notifications:** Keeps users informed about contract updates, salary payments, and other important events.
- **Performance Metrics:** Supports the input and management of job-related performance metrics.
- **Admin Panel:** Provides an efficient backend management interface for system administrators.
- **Dispute Resolution:** Offers mechanisms to resolve disputes based on contract terms.
- **Custom Theming:** Supports dark and light modes for the user interface.
- **Scalability and Security:** Ensures the system can handle a growing number of users and contracts securely.

## Technology Stack

- **Backend:** Django Rest Framework
- **Frontend:** React Native + Expo
- **AI Model:** OpenAI's GPT-3.5 Turbo
- **Smart Contracts:** Solidity
- **Database:** PostgreSQL
- **Notifications:** Redis Server
- **Encryption:** Nginx for HTTPS and WSS
- **Testing:** Pytest and Jest + GitHub Actions CI/CD pipeline
- **Deployment:** Google Cloud Platform and Expo SDK
- **Containerisation:** Docker 

## Objectives and Benefits

AI-Chain-Contracts aims to offer a reliable, efficient, and secure platform for managing and enforcing employment contracts. By automating the conversion process and ensuring secure transactions through blockchain technology, the platform raises transparency and trust between employers and employees. The use of stable cryptocurrencies like USDC Coin for salary payments minimises financial risks, making it a practical solution for modern employment management.

This project lays the groundwork for future advancements, including the integration of more complex job-specific performance metrics and the expansion of smart contract applications in various employment scenarios. The ultimate goal is to provide a comprehensive solution that addresses the current shortcomings in employment management and promotes fair and transparent interactions in the digital employment market.

## Test Usage

Everything has already been deployed, in order to test the app, please scan the QR code below:

![QR Code](deployed-app-qr-code.png)

Alternatively, you can use this link:

```
https://expo.dev/preview/update?message=Deployment&updateRuntimeVersion=1.0.0&createdAt=2024-08-07T06%3A28%3A05.730Z&slug=exp&projectId=0a2a6a79-5818-4f5a-9566-594e07108536&group=fecf04f0-ab35-4650-b482-97adfa35e0a5
```

If you would like to deploy locally, globally, or redeploy the production server and frontend, please navigate to the backend and frontend folders. Their README files will guide you through the process.

## VM Instance Details

If you would like to access the VM, please use the following command:
```bash
gcloud compute ssh --zone "europe-west1-d" "instance-asac-prj-kcl" --project "asac-pjr-at-kcl"
```

The passphrase is 
```
Mellisa6
```

In case this would not work, use the command below.
Please be careful with the private ssh key, do not share it anywhere.

```bash
echo "-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCks9satqanaIJtLqBiodo/MIfPUMJWiADlkIG/wE5ofwAAAKDfGwEO3xsB
DgAAAAtzc2gtZWQyNTUxOQAAACCks9satqanaIJtLqBiodo/MIfPUMJWiADlkIG/wE5ofw
AAAEDNN5vHvQikFBcWee89F4CV+5t/0lns+Bf74Paf8YICeKSz2xq2pqdogm0uoGKh2j8w
h89QwlaIAOWQgb/ATmh/AAAAGGV6emF0LmFsc2FsaWJpQGtjbC5hYy51awECAwQF
-----END OPENSSH PRIVATE KEY-----" > /tmp/temp_key && chmod 600 /tmp/temp_key && ssh -i /tmp/temp_key xez@35.205.90.226 && rm /tmp/temp_key
```
