import React, { useContext, useEffect, useState, useRef } from 'react';
import { LayoutAnimation, Modal, View, Text, TextInput, TouchableOpacity, findNodeHandle, ScrollView, Keyboard, Dimensions } from 'react-native';
import getStyles from '../../../styles/SharedStyles';
import { ThemeContext } from '../../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeScreen } from './UseHomeScreen';
import { ContractItem } from './ContractItem';
import { useFocusEffect } from '@react-navigation/native';
import getLocalStyles from './LocalSharedStyles';
import { useKeyboard } from '../../../components/Keyboard';

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

    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

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

    useEffect(() => {
        const id = "HomeScreen"; 
        registerScrollViewRef(id, scrollViewRef);

        return () => {
            unregisterScrollViewRef(id);
        };
    }, [registerScrollViewRef, unregisterScrollViewRef]);

    return (
        <View style={[sharedStyles.avoidingTabBarContainer, { paddingBottom: keyboardHeight, marginBottom: 0 }]}>
            <ScrollView ref={scrollViewRef} style={sharedStyles.avoidingTabBarContainer} showsVerticalScrollIndicator={false}>
                <View style={sharedStyles.container}>
                    <Text style={sharedStyles.pageHeaderText}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={sharedStyles.cardContainer}>
                        {Object.values(errors).some(error => error) && (
                            <TouchableOpacity
                                style={sharedStyles.errorIconContainer}
                                onPress={() => setShowErrorDetails(true)}>
                                <MaterialCommunityIcons name="alert-circle" size={24} style={{color: 'red'}} />
                            </TouchableOpacity>
                        )}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showErrorDetails}
                            onRequestClose={() => setShowErrorDetails(false)}
                        >
                            <View style={sharedStyles.centeredViewContainer}>
                                <View style={sharedStyles.modalViewContainer}>
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
                       

                        <Text style={sharedStyles.cardHeaderText}>Produce a Solidity Smart Contract</Text>
                        {/* DropZone */}
                        <TouchableOpacity style={localStyles.dropZone} onPress={() => handleFileSelectDropZone()}>
                            {selectedFile ? (
                                <>
                                    <MaterialCommunityIcons name="file-document-outline" size={100} color = {theme === 'dark' ? 'white' : 'black'} />
                                    <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>{selectedFile.assets[0].name}</Text>
                                </>
                            ) : (
                                <Text style={[localStyles.inputFieldText]}>Tap to upload an employment contract</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput 
                        ref={contractNameRef} 
                        style={sharedStyles.inputField} 
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
                        style={sharedStyles.inputField} 
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
                        style={sharedStyles.inputField} 
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
                        style={sharedStyles.inputField} 
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
                            <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Create Contract</Text>
                        </TouchableOpacity>

                    </View>

                    {/* User's Smart Contracts */}
                    <View style={sharedStyles.cardContainer}>
                        <Text style={sharedStyles.cardHeaderText}>My Smart Contracts</Text>
                        {savedContracts.length === 0 ? (
                            <Text style={localStyles.noContractsView}>No saved contracts yet</Text>
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
                    <View style={sharedStyles.cardContainer}>
                        <Text style={sharedStyles.cardHeaderText}>Address Checksum Conversion</Text>
                        <TextInput 
                        ref={addressConversionRef} 
                        style={sharedStyles.inputField} 
                        placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} 
                        placeholder="Set your token address" 
                        value={addressChecksum} 
                        onChangeText={setAddressChecksum}
                        />

                        <TouchableOpacity
                            style={sharedStyles.button}
                            onPress={() => handleChecksumAddress()}
                        >
                            <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Validate Address</Text>
                        </TouchableOpacity>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showAddressModal}
                            onRequestClose={() => setShowAddressModal(false)}
                        >
                            <View style={sharedStyles.centeredViewContainer}>
                                <View style={sharedStyles.modalViewContainer}>
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
                                            //onPress={() => setShowAddressModal(false)}
                                            //style={sharedStyles.exitButton}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>


                    {/* Footer Section */}
                    <View style={localStyles.footer}>
                        <Text style={sharedStyles.generalText}>All rights reserved © Al-Slebi AI-Contracts</Text>
                    </View>

                </View>
            </ScrollView>

            {/* Separator Line */}
            <View style={[sharedStyles.separatorLine, {bottom: keyboardHeight + 90}]} />

        </View >
    );
};

export default HomeScreen;
