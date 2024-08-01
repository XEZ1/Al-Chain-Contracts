from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
import torch
from torch.utils.data import Dataset
import json

# Load the testing dataset
with open("sample_data/contracts_dataset_training.json", "r") as f:
    training_data = json.load(f)

with open("sample_data/contracts_dataset_testing.json", "r") as f:
  testing_data = json.load(f)

tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-neo-125m")

# Set the tokenizer's pad token to be the same as its EOS token
tokenizer.pad_token = tokenizer.eos_token

class ContractDataset(Dataset):
    def __init__(self, tokenizer, data, max_length=512):
        self.tokenizer = tokenizer
        self.data = data
        self.max_length = max_length
        # Define a prompt that clearly states the task for the model
        self.prompt = "Convert the following legal employment contract to a Solidity smart contract:"

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        record = self.data[idx]
        input_text = record["legal_contract"]
        target_text = record["smart_contract"]

        # Prepend the prompt to the input text
        combined_text = f"{self.prompt}\n\n{input_text}\n\n{tokenizer.eos_token}{target_text}"

        # Encode the combined text with the prompt
        encoding = tokenizer(combined_text,
                             truncation=True,
                             max_length=self.max_length,
                             padding="max_length",
                             return_tensors="pt")

        # Adjust labels for training: labels are input_ids shifted by one token to the left
        labels = encoding.input_ids.clone()
        labels[labels == tokenizer.pad_token_id] = -100

        return {"input_ids": encoding.input_ids.squeeze(), "attention_mask": encoding.attention_mask.squeeze(), "labels": labels.squeeze()}

# Prepare the training and testing datasets
train_dataset = ContractDataset(tokenizer, training_data)
test_dataset = ContractDataset(tokenizer, testing_data)

model = AutoModelForCausalLM.from_pretrained("EleutherAI/gpt-neo-125m")

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=1,  # Adjust based on your GPU memory
    per_device_eval_batch_size=1,   # Adjust based on your GPU memory
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    evaluation_strategy="steps",
    logging_steps=10,
    save_strategy="steps",
    save_steps=500,
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

trainer.train()

