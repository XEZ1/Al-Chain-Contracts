import React, { useState, useContext } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BACKEND_URL } from '@env';

export const useContractHandling = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [contractName, setContractName] = useState('');
    const [employerAddress, setEmployerAddress] = useState('');
    const [authAppAddress, setAuthAppAddress] = useState('');
    const [tokenContractInterface, setTokenContractInterface] = useState('');
    const [savedContracts, setSavedContracts] = useState([]);


    const handleFileSelectDropZone = async (onFileSelected) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'], // ["*/*"] for accepting all types
                copyToCacheDirectory: true,
                multiple: false
            });
            console.log(result.canceled);
            if (result.canceled) {
                //Alert.alert("Cancelled", "File selection was cancelled.");
                return;
            }
            if (result.assets[0].mimeType == 'text/plain') {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onFileSelected(result);
            } 
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "An error occurred during file selection.");
        }
    };

    const uploadContractData = async () => {
        if (!selectedFile) {
            Alert.alert("Error", "Please select a file before creating a contract.");
            return;
        }

        const formData = new FormData();

        const fileContent = await FileSystem.readAsStringAsync(selectedFile.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
        formData.append('contract_content', fileContent);

        formData.append('contract_name', contractName);
        formData.append('employer_address', employerAddress);
        formData.append('auth_app_address', authAppAddress);
        formData.append('token_contract_interface', tokenContractInterface);

        try {
            const token = await SecureStore.getItemAsync('authToken');

            const response = await fetch(`${BACKEND_URL}/contracts/generate-contract/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
            const responseJson = await response.json();
            saveSolidityFile(responseJson.solidity_code, contractName);
            //Alert.alert("Success", "Contract data uploaded successfully.");
        } catch (error) {
            Alert.alert("Upload Error", "An error occurred while uploading contract data.");
        }
    };

    const saveSolidityFile = async (solidityCode, fileName) => {
        const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + fileName + '.sol');
        if (fileInfo.exists) {
            console.log(`${fileName}.sol already exists. Overwriting...`);
        }
        try {
            const filePath = FileSystem.documentDirectory + fileName + '.sol';
            await FileSystem.writeAsStringAsync(filePath, solidityCode, { encoding: FileSystem.EncodingType.UTF8 });
            setSavedContracts(prevContracts => [...prevContracts, fileName]);
            Alert.alert("Success", `Contract was generated and saved as ${fileName}.sol to ${filePath}`);
        } catch (error) {
            if (error instanceof TypeError) { 
                // Skip
            } else {
                console.error("Error saving Solidity file:", error.message);
                Alert.alert("Error", "Failed to save the contract file.");
            }
        }
    };

    const openContract = async (contractName) => {
        console.log(contractName);
        try {
            const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
            // Check if the sharing is available
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert("Error", "Sharing not available on this device");
                return;
            }

            await Sharing.shareAsync(filePath);
        } catch (error) {
            Alert.alert("Error", "Could not share the contract file.");
            console.error(error);
        }
    };

    const fetchAndSyncContracts = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/contracts/get-user-contracts/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const contracts = await response.json();
            // contracts.forEach(contract => {
            //     console.log(contract.contract_name);
            // });
            await syncContracts(contracts);
        } catch (error) {
            console.error("Error fetching contracts:", error);
            Alert.alert("Error", "Failed to fetch contracts.");
        }
    };

    const syncContracts = async (contracts) => {
        const documentDirectory = FileSystem.documentDirectory;
        const localFiles = await FileSystem.readDirectoryAsync(documentDirectory);

        const downloadPromises = contracts.map(async (contract) => {
            const localFilePath = `${documentDirectory}${contract.name}.sol`;
            console.log
            if (!localFiles.includes(`${contract.contract_name}.sol`)) {
                // Download and save file if it does not exist locally
                console.log(`Downloading and saving ${contract.contract_name}...`);
                saveSolidityFile(contract.code, contract.contract_name);
            } else {
                //console.log("Everything has already been locally saved")
            }
            return { ...contract, localFilePath };
        });

        const updatedContracts = await Promise.all(downloadPromises);
        setSavedContracts(updatedContracts);
    };



    return {
        selectedFile,
        setSelectedFile,
        contractName,
        setContractName,
        employerAddress,
        setEmployerAddress,
        authAppAddress,
        setAuthAppAddress,
        tokenContractInterface,
        setTokenContractInterface,
        savedContracts,
        handleFileSelectDropZone,
        uploadContractData,
        openContract,
        fetchAndSyncContracts,

    };
};