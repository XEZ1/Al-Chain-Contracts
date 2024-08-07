# AIModelTraining

This directory contains scripts and datasets for fine-tuning OpenAI's GPT-3.5 Turbo and two models from Hugging Face. It also includes the necessary configurations to compile smart contracts using npm.

## Directory Structure

- `data/` - Contains unsorted datasets used for fine-tuning the AI models.
- `openAI LLM/` - Contains scripts and configurations specific to fine-tuning the GPT-3.5 Turbo model.
- `other LLMs/` - Contains scripts and configurations for fine-tuning models from Hugging Face.
- `output/` - Directory for storing the output from the smart contract compilation process.
- `package-lock.json` - npm package lock file for ensuring consistent installs.
- `package.json` - npm package file for managing dependencies.
- `truffle-config.js` - Configuration file for compiling smart contracts with Truffle.

## Instructions

### Fine-Tuning Models

To refine-tune the models, follow the scripts provided in the respective directories (`openAI LLM` and `other LLMs`).

### Compiling Smart Contracts

To compile the smart contracts, ensure you have npm installed. Navigate to the directory and run the following command:

```bash
npm install
```

This will install the required dependencies as specified in the package.json file.

To compile the smart contracts, run:
```bash
truffle compile
```