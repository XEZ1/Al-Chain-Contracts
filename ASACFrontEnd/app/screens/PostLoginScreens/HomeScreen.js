import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import * as DocumentPicker from 'expo-document-picker';
//import debounce from 'lodash/debounce';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropZone = ({ onFileSelected, selectedFile }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles();

    const handleFileSelect = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], //, 'text/plain'], // ["*/*"] to accept all types
                copyToCacheDirectory: true,
                multiple: false
            });
            console.log(result.assets[0].mimeType == 'application/pdf' || result.assets[0].mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            if (result.assets[0].mimeType == 'application/pdf' || result.assets[0].mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onFileSelected({ name: result.name, uri: result.uri });
                //onFileSelected(result);
            } else {
                console.log(result)
                Alert.alert("Cancelled", "File selection was cancelled.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred during file selection.");
        }
    };

    return (
        <TouchableOpacity style={styles.dropZone} onPress={handleFileSelect}>
            {selectedFile ? (
                <>
                    <MaterialCommunityIcons name="file-document-outline" size={100} color="black" />
                    <Text style={styles.buttonText}>{selectedFile.name}</Text>
                </>
            ) : (
                <Text style={styles.buttonText}>Tap to select a .docx / .pdf / .txt file</Text>
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

    //const debouncedSetContractName = useCallback(debounce(setContractName, 500), []);
    //const debouncedSetEmployerAddress = useCallback(debounce(setEmployerAddress, 500), []);
    //const debouncedSetAuthAppAddress = useCallback(debounce(setAuthAppAddress, 500), []);
    //const debouncedSetTokenContractInterface = useCallback(debounce(setTokenContractInterface, 500), []);

    const uploadContractData = async () => {
        if (!selectedFile) {
            Alert.alert("Error", "Please select a file before creating a contract.");
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: selectedFile.uri,
            type: selectedFile.mimeType,
            name: selectedFile.name,
        });

        formData.append('contractName', contractName);
        formData.append('employerAddress', employerAddress);
        formData.append('authAppAddress', authAppAddress);
        formData.append('tokenContractInterface', tokenContractInterface);

        try {
            const response = await fetch(`${BACKEND_URL}/generate-contract/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const responseJson = await response.json();
            Alert.alert("Success", "Contract data uploaded successfully.");
        } catch (error) {
            Alert.alert("Upload Error", "An error occurred while uploading contract data.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <ScrollView style={styles.scrollView}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                >
                    <Text style={styles.header}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Upload an Employment Contract</Text>
                        <DropZone onFileSelected={setSelectedFile} selectedFile={selectedFile} />
                        {selectedFile && (
                            <Text style={styles.fileName}>File: {selectedFile.name}</Text>
                        )}
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
                        {/* This would be a list component that lists the contracts the user has created */}
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
