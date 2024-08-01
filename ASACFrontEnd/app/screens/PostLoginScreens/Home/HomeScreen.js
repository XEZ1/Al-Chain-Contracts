import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ContractItem } from './ContractItem';
import { useHomeScreen } from './UseHomeScreen';
import { useKeyboard } from '../../../components/Keyboard';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesHomeScreens from '../../../styles/LocallySharedStylesHomeScreens';


/**
 * HomeScreen component for displaying the main user interface for contract management.
 * @param {object} props - The props object for the component.
 * @param {object} props.navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The HomeScreen component.
 */
const HomeScreen = ({ navigation }) => {
    // Retrieve theme from the ThemeContext
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesHomeScreens(theme);

    // Ref to handle ScrollView input focus
    const scrollViewRef = useRef(null);
    // Custom hook to manage keyboard state
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    // Custom hooks to manage the home screen logic
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

    /**
     * Fetch and sync contracts on component mount
     */
    useEffect(() => {
        fetchAndSyncContracts();
    }, []);

    /**
     * Register ScrollView ScrollView ref on focus
     */
    useFocusEffect(
        useCallback(() => {
            const id = "HomeScreen";
            registerScrollViewRef(id, scrollViewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
    );

    return (
        <View style={[localStyles.backgroundContainer, { paddingBottom: keyboardHeight }]}>
            <ScrollView ref={scrollViewRef} style={keyboardHeight > 0 && Platform.OS === 'android' ? sharedStyles.avoidingTabBarContainer : sharedStyles.mediumMarginBottom } showsVerticalScrollIndicator={false} testID='scrollViewTestID'>
                <View style={sharedStyles.container}>
                    <Text style={sharedStyles.pageHeaderText}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={[sharedStyles.cardContainer]}>
                        {Object.values(errors).some(error => error) && (
                            <TouchableOpacity
                                testID='errorIconTestID'
                                style={sharedStyles.errorIconContainer}
                                onPress={() => setShowErrorDetails(true)}>
                                <MaterialCommunityIcons name="alert-circle" size={24} style={{ color: 'red' }} />
                            </TouchableOpacity>
                        )}
                        <Modal
                            testID='errorModalTestID'
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
                                    <TouchableOpacity style={[sharedStyles.button]} onPress={() => setShowErrorDetails(false)}>
                                        <Text style={sharedStyles.textStyle}>Got it</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={sharedStyles.exitButton} onPress={() => setShowErrorDetails(false)} testID='exitButtonTestID'>
                                        <MaterialCommunityIcons name="close-circle" size={30} color='red'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <View style={sharedStyles.centeredText}>
                            <Text style={sharedStyles.cardHeaderText}>Build a Solidity Smart Contract</Text>
                        </View>
                        {/* DropZone */}
                        <TouchableOpacity style={localStyles.dropZone} onPress={() => handleFileSelectDropZone()} testID='dropZoneButtonTestID'>
                            {selectedFile ? (
                                <>
                                    <MaterialCommunityIcons name="file-document-outline" size={100} color={theme === 'dark' ? 'white' : 'black'} testID='dropZoneContractIconTestID'/>
                                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>{selectedFile.assets[0].name}</Text>
                                </>
                            ) : (
                                <Text style={[localStyles.inputFieldText]}>Tap to upload an employment contract</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput
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
                            <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Create Contract</Text>
                        </TouchableOpacity>

                    </View>

                    {/* User's Smart Contracts */}
                    <View style={sharedStyles.cardContainer}>
                        <View style={sharedStyles.centeredText}>
                            <Text style={sharedStyles.cardHeaderText}>My Smart Contracts</Text>
                        </View>
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
                        <View style={sharedStyles.centeredText}>
                            <Text style={sharedStyles.cardHeaderText}>Address Checksum Conversion</Text>
                        </View>
                        <TextInput
                            testID='addressChecksumInputFieldTestID'
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            placeholder="Set your token address"
                            value={addressChecksum}
                            onChangeText={setAddressChecksum}
                        />

                        <TouchableOpacity
                            testID='validateAddressButtonTestID'
                            style={sharedStyles.button}
                            onPress={() => handleChecksumAddress()}
                        >
                            <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Validate Address</Text>
                        </TouchableOpacity>
                        <Modal
                            testID='addressModalTestID'
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
                                        testID='copyAddressButtonTestID'
                                        style={sharedStyles.button}
                                        onPress={() => { copyToClipboard(); setShowAddressModal(false) }}
                                    >
                                        <Text style={sharedStyles.textStyle}>Copy Address</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        testID='exitAddressButtonTestID'
                                        style={sharedStyles.exitButton}
                                        onPress={() => setShowAddressModal(false)}
                                    >
                                        <MaterialCommunityIcons
                                            name="close-circle"
                                            size={30}
                                            color='red'
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
            <View style={[sharedStyles.separatorLine, { bottom:  keyboardHeight > 0 && Platform.OS === 'android' ? 0 : keyboardHeight + 90  }]} testID='separatorLineTestID'/>

        </View >
    );
};

export default HomeScreen;
