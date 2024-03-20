import { useState, useEffect } from 'react';
import { Alert, LayoutAnimation,  } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BACKEND_URL } from '@env';
import * as Clipboard from 'expo-clipboard';


export const useContractHandling = (navigation) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [contractName, setContractName] = useState('');
    const [employerAddress, setEmployerAddress] = useState('');
    const [authAppAddress, setAuthAppAddress] = useState('');
    const [tokenContractInterface, setTokenContractInterface] = useState('');
    const [savedContracts, setSavedContracts] = useState([]);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [validatedAddress, setValidatedAddress] = useState('');
    const [errors, setErrors] = useState({});
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [addressChecksum, setAddressChecksum] = useState('');


    const isValidEthereumAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);
    const isValidHexadecimal = (value) => /^0x[a-fA-F0-9]+$/.test(value);
    const isValidContractName = (name) => /^[a-zA-Z0-9\s]{3,100}$/.test(name);

    useEffect(() => {
        setIsComponentMounted(true);

        return () => {
            setIsComponentMounted(false);
        };
    }, []);

    const handleFileSelectDropZone = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'], // ["*/*"] for accepting all types
                copyToCacheDirectory: true,
                multiple: false
            });
            if (result.canceled && selectedFile !== null) {
                if (isComponentMounted) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                setSelectedFile(null);
                return;
            } else if (result.canceled && selectedFile === null) {
                return;
            }
            if (result.assets[0].mimeType == 'text/plain') {
                if (isComponentMounted) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                setSelectedFile(result);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred during file selection.");
        }
    };

    const uploadContractData = async () => {
        if (Object.values(errors).some(error => error)) {
            Alert.alert("Validation Errors", "Please fix the errors before proceeding.");
            return;
        }

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
            if (isComponentMounted) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setSelectedFile(null);
                setContractName('');
                setEmployerAddress('');
                setAuthAppAddress('');
                setTokenContractInterface('');
            }
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
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSavedContracts(prevContracts => [...prevContracts, { contract_name: fileName }]);
            Alert.alert("Success", `Contract was generated and saved as ${fileName}.sol to ${filePath}`);
        } catch (error) {
            console.error("Error saving Solidity file:", error.message);
            Alert.alert("Error", "Failed to save the contract file.");

        }
    };

    const shareContract = async (contractName) => {
        console.log(contractName);
        try {
            const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
            console.log(filePath);
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

    const openContract = (contractName) => {
        console.log(contractName);
        try {
            const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
            console.log(filePath);
            navigation.navigate('EditorScreen', { filePath });
        } catch (error) {
            Alert.alert("Error", "Could not open the contract file")
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

    const handleDeleteContract = async (contractToDelete) => {
        if (!isComponentMounted) {
            return;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            await fetch(`${BACKEND_URL}/contracts/delete-contract/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'X-Contract-Name': contractToDelete.contract_name,
                },
            });

            const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            console.log(`Deleted local file: ${filePath}`);

            // Update local state to reflect deletion
            setSavedContracts(currentContracts =>
                currentContracts.filter(contract => contract.contract_name !== contractToDelete.contract_name)
            );
        } catch (error) {
            console.error(error);
            alert('Error deleting the contract:', error);
        }
    };

    const cleanExpoFolder = async () => {
        const filesInDirectory = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        for (const fileName of filesInDirectory) {
            const filePath = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.deleteAsync(filePath, { idempotent: true });
            console.log(`Deleted local file: ${filePath}`);
        }
        console.log('Succesfully deleted all file in the expo folder')
    }

    const isValidJson = (value) => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    };

    const getValidationErrorMessage = (field, value) => {
        switch (field) {
            case 'employerAddress':
            case 'authAppAddress':
                if (!isValidEthereumAddress(value)) return 'Invalid Ethereum address. Must start with 0x followed by 40 hexadecimal characters.';
                break;
            case 'contractName':
                if (!isValidContractName(value)) return 'Invalid contract name. Must be 3-100 characters long and contain only letters, numbers, and spaces.';
                break;
            case 'tokenContractInterface':
                //    if (!isValidJson(value)) return 'Invalid token contract interface. Must be valid JSON.';
                if (!isValidHexadecimal(value)) return 'Invalid hexadecimal value.';
                break;
            default:
                return '';
        }
    };

    const handleChecksumAddress = async () => {
        try {
            if (!addressChecksum) {
                alert(`Error: Please fill the input field`);
                return;
            }
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/contracts/get-valid-checksum-address/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'X-Token-Address': addressChecksum,
                },
            });
            verifiedAddress = await response.json();
            console.log(verifiedAddress);
            if (verifiedAddress.error) {
                alert(`Error: ${verifiedAddress.error}`);
            } else {
                setValidatedAddress(verifiedAddress.address);
                setShowAddressModal(true);
            }
        } catch (error) {
            console.error(error);
            alert('Error verifying the address:', error);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setStringAsync(validatedAddress);
        alert('Copied to clipboard!');
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
        validatedAddress,
        setValidatedAddress,
        showAddressModal,
        setShowAddressModal,
        errors,
        setErrors,
        showErrorDetails,
        setShowErrorDetails,
        addressChecksum,
        setAddressChecksum,
        savedContracts,
        handleFileSelectDropZone,
        uploadContractData,
        shareContract,
        openContract,
        fetchAndSyncContracts,
        handleDeleteContract,
        getValidationErrorMessage,
        handleChecksumAddress,
        copyToClipboard,
    };
};
