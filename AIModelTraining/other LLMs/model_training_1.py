from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
import torch
import json

# Load the testing dataset
with open("sample_data/contracts_dataset_training.json", "r") as f:
    training_data = json.load(f)

with open("sample_data/contracts_dataset_testing.json", "r") as f:
  testing_data = json.load(f)

tokenizer = AutoTokenizer.from_pretrained("Salesforce/codegen-350M-multi")

# Ensure the tokenizer has a padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Use EOS token as a padding token

def tokenize_function(examples):
    # Tokenize the input texts
    return tokenizer(examples["legal_contract"], padding="max_length", truncation=True, max_length=512)

# Tokenize the datasets
train_encodings = [tokenize_function(ex) for ex in training_data]
test_encodings = [tokenize_function(ex) for ex in testing_data]


train_encodings = list(map(tokenize_function, training_data))
test_encodings = list(map(tokenize_function, testing_data))

class ContractDataset(torch.utils.data.Dataset):
    def __init__(self, encodings):
        self.encodings = encodings

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings[idx].items()}
        item['labels'] = item['input_ids'].clone()
        return item

    def __len__(self):
        return len(self.encodings)


train_dataset = ContractDataset(train_encodings)
test_dataset = ContractDataset(test_encodings)

model = AutoModelForCausalLM.from_pretrained("Salesforce/codegen-350M-multi")

training_args = TrainingArguments(
    output_dir="./results",          # output directory for model checkpoints
    num_train_epochs=3,              # number of training epochs
    per_device_train_batch_size=4,   # batch size for training
    per_device_eval_batch_size=4,    # batch size for evaluation
    warmup_steps=500,                # number of warmup steps
    weight_decay=0.01,               # strength of weight decay
    logging_dir="./logs",            # directory for storing logs
    evaluation_strategy="epoch",     # evaluate each `logging_steps`
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

trainer.train()
