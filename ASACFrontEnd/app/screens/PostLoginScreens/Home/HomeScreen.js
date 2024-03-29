import React, { useContext, useEffect, useState, useRef } from 'react';
import { LayoutAnimation, Modal, View, Text, TextInput, TouchableOpacity, findNodeHandle, ScrollView, Keyboard, Dimensions } from 'react-native';
import getStyles from '../../../styles/SharedStyles';
import { ThemeContext } from '../../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeScreen } from './UseHomeScreen';
import { ContractItem } from './ContractItem';
import { useFocusEffect } from '@react-navigation/native';
import getLocalStyles from './LocalSharedStyles';

import * as SecureStore from 'expo-secure-store';


const HomeScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme); 

    const contractNameRef = useRef(null);
    const employerAddressRef = useRef(null);
    const authAppAddressRef = useRef(null);
    const tokenContractInterfaceRef = useRef(null);
    const addressConversionRef = useRef(null);
    const scrollViewRef = useRef(null);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const {
        selectedFile, setSelectedFile,
        contractName, setContractName,
        employerAddress, setEmployerAddress,
        authAppAddress, setAuthAppAddress,
        tokenContractInterface, setTokenContractInterface,
        validatedAddress, setValidatedAddress,
        showAddressModal, setShowAddressModal,
        errors, setErrors,
        showErrorDetails, setShowErrorDetails,
        addressChecksum, setAddressChecksum,
        savedContracts, handleFileSelectDropZone,
        uploadContractData, shareContract,
        openContract, fetchAndSyncContracts,
        handleDeleteContract, validateInput, 
        handleChecksumAddress, copyToClipboard,
    } = useHomeScreen(navigation);

    useEffect(() => {
        fetchAndSyncContracts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const handleKeyboardDidShow = (e) => {
                const screenHeight = Dimensions.get('window').height;
                const endY = e.endCoordinates.screenY;
                LayoutAnimation.easeInEaseOut(); 
                setKeyboardHeight(screenHeight - endY - 90);

                const currentlyFocusedField = TextInput.State.currentlyFocusedInput();
                if (currentlyFocusedField) {
                    const nodeHandle = findNodeHandle(currentlyFocusedField);
                    scrollViewRef.current?.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
                        nodeHandle,
                        160,
                        true
                    );
                }
            };

            const handleKeyboardDidHide = () => {
                LayoutAnimation.easeInEaseOut(); 
                setKeyboardHeight(0);
            };

            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, [])
    );

    const getNotificationToken = async () => {
        console.log(await SecureStore.getItemAsync('notificationToken'));
    };

    return (
        <View style={[sharedStyles.baseContainer, { paddingBottom: keyboardHeight }]}>
            <ScrollView ref={scrollViewRef} style={sharedStyles.scrollView} showsVerticalScrollIndicator={false}>
                <View
                    style={sharedStyles.container}
                >
                    <Text style={sharedStyles.header}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={sharedStyles.card}>
                        {Object.values(errors).some(error => error) && (
                            <TouchableOpacity
                                style={sharedStyles.errorIconContainer}
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
                            <View style={sharedStyles.centeredView}>
                                <View style={sharedStyles.modalView}>
                                    <Text style={sharedStyles.modalText}>Please fix the following errors:</Text>
                                    {Object.entries(errors).map(([key, value]) =>
                                        value ? <Text key={key} style={sharedStyles.errorListItem}>{`${key}: ${value}`}</Text> : null
                                    )}
                                    <TouchableOpacity
                                        style={[sharedStyles.button]}
                                        onPress={() => setShowErrorDetails(false)}
                                    >
                                        <Text style={sharedStyles.textStyle}>Got it</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <Text style={sharedStyles.cardHeader}>Upload an Employment Contract</Text>
                        {/* DropZone */}
                        <TouchableOpacity style={sharedStyles.dropZone} onPress={() => handleFileSelectDropZone()}>
                            {selectedFile ? (
                                <>
                                    <MaterialCommunityIcons name="file-document-outline" size={100} color="black" />
                                    <Text style={sharedStyles.buttonText}>{selectedFile.assets[0].name}</Text>
                                </>
                            ) : (
                                <Text style={[sharedStyles.dropZoneText, { color: theme === 'dark' ? 'grey' : 'darkgrey' }]}>Tap to select a .docx / .pdf / .txt file</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput 
                        ref={contractNameRef} 
                        style={sharedStyles.input} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} 
                        placeholder="Enter Contract Name" 
                        value={contractName} 
                        onChangeText={(value) => {
                            setContractName(value);
                            validateInput('contractName',
                                value);
                        }}
                        />
                        <TextInput 
                        ref={employerAddressRef} 
                        style={sharedStyles.input} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} 
                        placeholder="Set Employer's USDC Address" 
                        value={employerAddress} 
                        onChangeText={(value) => {
                            setEmployerAddress(value);
                            validateInput('employerAddress',
                                value);
                        }}
                        />
                        <TextInput 
                        ref={authAppAddressRef} 
                        style={sharedStyles.input} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} 
                        placeholder="Set AuthApp's Address" value={authAppAddress} 
                        onChangeText={(value) => {
                            setAuthAppAddress(value);
                            validateInput('authAppAddress',
                                value);
                        }}
                        />
                        <TextInput 
                        ref={tokenContractInterfaceRef} 
                        style={sharedStyles.input} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                        placeholder="Set USDC's Token Contract Interface" 
                        value={tokenContractInterface} 
                        onChangeText={(value) => {
                            setTokenContractInterface(value);
                            validateInput('tokenContractInterface',
                                value);
                        }}
                        />

                        <TouchableOpacity style={sharedStyles.button} onPress={uploadContractData}>
                            <Text style={sharedStyles.buttonText}>Create Contract</Text>
                        </TouchableOpacity>

                    </View>

                    {/* User's Smart Contracts */}
                    <View style={sharedStyles.card}>
                        <Text style={sharedStyles.cardHeader}>My Smart Contracts</Text>
                        {savedContracts.length === 0 ? (
                            <Text style={sharedStyles.noContractsText}>No saved contracts yet</Text>
                        ) : (
                            savedContracts.map((contract, index) => (
                                <ContractItem
                                    key={index}
                                    contract={contract}
                                    openContract={openContract}
                                    openShareContract={shareContract}
                                    deleteContract={handleDeleteContract}
                                    theme={theme} />
                            ))
                        )}
                    </View>

                    {/* Address Conversion */}
                    <View style={sharedStyles.card}>
                        <Text style={sharedStyles.cardHeader}>Address Checksum Conversion</Text>
                        <TextInput 
                        ref={addressConversionRef} 
                        style={sharedStyles.input} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} 
                        placeholder="Set your token address" value={addressChecksum} 
                        onChangeText={setAddressChecksum}
                        />

                        <TouchableOpacity
                            style={sharedStyles.button}
                            onPress={() => handleChecksumAddress()}
                        >
                            <Text style={sharedStyles.buttonText}>Validate Address</Text>
                        </TouchableOpacity>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showAddressModal}
                            onRequestClose={() => setShowAddressModal(false)}
                        >
                            <View style={sharedStyles.centeredView}>
                                <View style={sharedStyles.modalView}>
                                    <Text style={sharedStyles.modalText}>Validated Address:</Text>
                                    <Text style={sharedStyles.modalText}>{validatedAddress}</Text>
                                    <TouchableOpacity
                                        style={sharedStyles.button}
                                        onPress={() => { copyToClipboard(); setShowAddressModal(false) }}
                                    >
                                        <Text style={sharedStyles.textStyle}>Copy Address</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={sharedStyles.exitButton}
                                        onPress={() => setShowAddressModal(false)}
                                    >
                                        <MaterialCommunityIcons
                                            name="close-circle"
                                            size={30}
                                            color='red'
                                            onPress={() => setShowAddressModal(false)}
                                            style={sharedStyles.exitButton}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>


                    {/* Footer Section */}
                    <View style={sharedStyles.footer}>
                        <Text style={sharedStyles.footerText}>All rights reserved © Smart Contract Toolkit</Text>
                    </View>

                </View>
            </ScrollView>

            {/* Separator Line */}
            <View style={[sharedStyles.separatorLine, {bottom: keyboardHeight + 90}]} />

        </View >
    );
};

export default HomeScreen;
