import json
import os
from docx import Document

current_dir = os.path.dirname(os.path.abspath(__file__))
smart_contracts_dir = os.path.join(current_dir, 'Batch 1')
legal_contracts_dir = smart_contracts_dir
output_file = 'contracts_dataset.json'

contracts_data = []

for i in range(1, 101):  # Adjust range as needed
    smart_contract_path = os.path.join(smart_contracts_dir, f'smart_contract_{i}.sol')
    legal_contract_path = os.path.join(legal_contracts_dir, f'legal_employment_contract_{i}.docx')
    
    with open(smart_contract_path, 'r', encoding='utf-8') as sc_file:
        smart_contract = sc_file.read()
        
    doc = Document(legal_contract_path)
    legal_contract = '\\n'.join([para.text for para in doc.paragraphs])
        
    contracts_data.append({
        'smart_contract': smart_contract,
        'legal_contract': legal_contract
    })

with open(output_file, 'w', encoding='utf-8') as outfile:
    json.dump(contracts_data, outfile, indent=4, ensure_ascii=False)
