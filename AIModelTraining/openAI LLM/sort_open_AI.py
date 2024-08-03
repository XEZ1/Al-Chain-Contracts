import json
import os
from docx import Document

current_dir = os.path.dirname(os.path.abspath(__file__))
batch_dir = os.path.join(current_dir, 'Batch 1')
output_file = 'contracts_dataset_open_AI.jsonl'  # Use .jsonl for JSON Lines format

contracts_data = []

for i in range(1, 101):  # Loop through files
    smart_contract_path = os.path.join(batch_dir, f'smart_contract_{i}.sol')
    legal_contract_path = os.path.join(batch_dir, f'legal_employment_contract_{i}.docx')
    
    with open(smart_contract_path, 'r', encoding='utf-8') as sc_file:
        smart_contract = sc_file.read()
        
    doc = Document(legal_contract_path)
    legal_contract_text = '\\n'.join([para.text for para in doc.paragraphs])
    
    # Structure the data in the required format
    entry = {
        "messages": [
            {"role": "system", "content": "Convert the following legal employment contract into a Solidity smart contract. You shall pass back only code!"},
            {"role": "user", "content": f"Legal contract:\n\n{legal_contract_text}"},
            {"role": "assistant", "content": f"{smart_contract}"}
        ]
    }
    
    contracts_data.append(entry)

# Write the structured data to a .jsonl file
with open(output_file, 'w', encoding='utf-8') as outfile:
    for entry in contracts_data:
        json.dump(entry, outfile, ensure_ascii=False)
        outfile.write('\n')  # New line for each JSON object in JSON Lines format
