import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropZone = ({ onFileSelected, selectedFile }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles();

    const handleFileSelect = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'], // ["*/*"] for accepting all types
                copyToCacheDirectory: true,
                multiple: false
            });
            if (result.assets[0].mimeType == 'text/plain') {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onFileSelected(result);
            } else {
                Alert.alert("Cancelled", "File selection was cancelled.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred during file selection.");
        }
    };

    return (
        <TouchableOpacity style={styles.dropZone} onPress={handleFileSelect}>
            {selectedFile ? (
                <>
                    <MaterialCommunityIcons name="file-document-outline" size={100} color="black" />
                    <Text style={styles.buttonText}>{selectedFile.assets[0].name}</Text>
                </>
            ) : (
                <Text style={[styles.newButton, { color: theme === 'dark' ? 'grey' : 'darkgrey' }]}>Tap to select a .docx / .pdf / .txt file</Text>
            )}
        </TouchableOpacity>
    );
};

const HomeScreen = (navigation) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [selectedFile, setSelectedFile] = useState(null);

    const [contractName, setContractName] = useState('');
    const [employerAddress, setEmployerAddress] = useState('');
    const [authAppAddress, setAuthAppAddress] = useState('');
    const [tokenContractInterface, setTokenContractInterface] = useState('');

    const [savedContracts, setSavedContracts] = useState([]);

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
            //console.log(responseJson);
            console.log(responseJson.solidity_code);
            saveSolidityFile(responseJson.solidity_code, contractName);
            Alert.alert("Success", "Contract data uploaded successfully.");
        } catch (error) {
            Alert.alert("Upload Error", "An error occurred while uploading contract data.");
            console.error(error);
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

            Alert.alert("Success", `Contract saved as ${fileName}.sol to ${filePath}`);
            // Optionally, if you want to open the file or share it, you can use the filePath.
        } catch (error) {
            console.error("Error saving Solidity file:", error);
            Alert.alert("Error", "Failed to save the contract file.");
        }
    };

    const openContract = async (contractName) => {
        try {
            const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
            const content = await FileSystem.readAsStringAsync(filePath);
            Alert.alert(contractName, content); // Simple example; consider a more robust display method
        } catch (error) {
            Alert.alert("Error", "Could not open the contract.");
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <ScrollView style={styles.scrollView}>
                <KeyboardAvoidingView
                    style={styles.container}
                >
                    <Text style={styles.header}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Upload an Employment Contract</Text>
                        <DropZone onFileSelected={setSelectedFile} selectedFile={selectedFile} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Contract Name" value={contractName} onChangeText={setContractName} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set Employer's USDC Address" value={employerAddress} onChangeText={setEmployerAddress} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set AuthApp's Address" value={authAppAddress} onChangeText={setAuthAppAddress} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set USDC's Token Contract Interface" value={tokenContractInterface} onChangeText={setTokenContractInterface} />
                        <TouchableOpacity style={styles.button} onPress={uploadContractData}>
                            <Text style={styles.buttonText}>Create Contract</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Contract Templates Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Contract Templates</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>ERC20 Token</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>ERC721 Token</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Crowdsale</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Contract Deployment Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Deploy Your Contract</Text>
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Network (e.g., Ethereum, Binance Smart Chain)" />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Deploy Contract</Text>
                        </TouchableOpacity>
                    </View>

                    {/* User's Contracts Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>My Contracts</Text>
                        {savedContracts.length > 0 ? (
                            savedContracts.map((contractName, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dropZone, styles.contractItem]} // Reuse dropZone style for similarity
                                    onPress={() => openContract(contractName)}>
                                    <MaterialCommunityIcons name="file-document-outline" size={50} color="black" />
                                    <Text style={styles.buttonText}>{contractName}.sol</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noContractsText}>No contracts saved.</Text>
                        )}
                    </View>

                    {/* Additional Features */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Tools & Utilities</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Contract Interactions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Transaction History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Smart Contract Analytics</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>All rights reserved © Smart Contract Toolkit</Text>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>

            {/* Separator Line */}
            <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />

        </View>
    );
};

export default HomeScreen;
