import React, { useContext, useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, UIManager } from 'react-native';
import getStyles from '../../../styles/SharedStyles';
import { ThemeContext } from '../../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContractHandling } from './UseHomeScreen';
import { ContractItem } from './ContractItem';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [errors, setErrors] = useState({});
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [addressChecksum, setAddressChecksum] = useState('');

    const {
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
        openShareContract,
        openContract,
        fetchAndSyncContracts,
        handleDeleteContract,
        getValidationErrorMessage,
    } = useContractHandling(navigation, errors, setErrors);

    const validateInput = (field, value) => {
        const errorMessage = getValidationErrorMessage(field, value);
        setErrors({ ...errors, [field]: errorMessage });
    };

    useEffect(() => {
        fetchAndSyncContracts();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <ScrollView style={styles.scrollView}>
                <KeyboardAvoidingView
                    style={styles.container}
                >
                    <Text style={styles.header}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={styles.card}>
                        {Object.values(errors).some(error => error) && (
                            <TouchableOpacity
                                style={styles.errorIconContainer}
                                onPress={() => setShowErrorDetails(true)}>
                                <MaterialCommunityIcons name="alert-circle" size={24} style={styles.errorIcon} />
                            </TouchableOpacity>
                        )}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showErrorDetails}
                            onRequestClose={() => setShowErrorDetails(false)}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Please fix the following errors:</Text>
                                    {Object.entries(errors).map(([key, value]) =>
                                        value ? <Text key={key} style={styles.errorListItem}>{`${key}: ${value}`}</Text> : null
                                    )}
                                    <TouchableOpacity
                                        style={[styles.button]}
                                        onPress={() => setShowErrorDetails(false)}
                                    >
                                        <Text style={styles.textStyle}>Got it</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <Text style={styles.cardHeader}>Upload an Employment Contract</Text>
                        {/* DropZone */}
                        <TouchableOpacity style={styles.dropZone} onPress={() => handleFileSelectDropZone(setSelectedFile)}>
                            {selectedFile ? (
                                <>
                                    <MaterialCommunityIcons name="file-document-outline" size={100} color="black" />
                                    <Text style={styles.buttonText}>{selectedFile.assets[0].name}</Text>
                                </>
                            ) : (
                                <Text style={[styles.dropZoneText, { color: theme === 'dark' ? 'grey' : 'darkgrey' }]}>Tap to select a .docx / .pdf / .txt file</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Contract Name" value={contractName} onChangeText={(value) => {
                            setContractName(value);
                            validateInput('contractName',
                                value);
                        }}
                        />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set Employer's USDC Address" value={employerAddress} onChangeText={(value) => {
                            setEmployerAddress(value);
                            validateInput('employerAddress',
                                value);
                        }}
                        />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set AuthApp's Address" value={authAppAddress} onChangeText={(value) => {
                            setAuthAppAddress(value);
                            validateInput('authAppAddress',
                                value);
                        }}
                        />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set USDC's Token Contract Interface" value={tokenContractInterface} onChangeText={(value) => {
                            setTokenContractInterface(value);
                            validateInput('tokenContractInterface',
                                value);
                        }}
                        />

                        <TouchableOpacity style={styles.button} onPress={uploadContractData}>
                            <Text style={styles.buttonText}>Create Contract</Text>
                        </TouchableOpacity>

                    </View>

                    {/* User's Smart Contracts */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>My Smart Contracts</Text>
                        {savedContracts.length === 0 ? (
                            <Text style={styles.noContractsText}>No saved contracts yet</Text>
                        ) : (
                            savedContracts.map((contract, index) => (
                                <ContractItem
                                    key={index}
                                    contract={contract}
                                    openContract={openContract}
                                    openShareContract={openShareContract}
                                    deleteContract={handleDeleteContract}
                                    theme={theme} />
                            ))
                        )}
                    </View>

                    {/* Address Conversion */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Address Checksum Conversion</Text>
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set your token address" value={addressChecksum} onChangeText={setAddressChecksum}></TextInput>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleChecksumAddress(addressInput)}
                        >
                            <Text style={styles.buttonText}>Validate Address</Text>
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

        </View >
    );
};

export default HomeScreen;
