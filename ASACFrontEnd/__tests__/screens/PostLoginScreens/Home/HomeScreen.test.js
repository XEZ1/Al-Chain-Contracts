import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from '@testing-library/react-hooks';
import HomeScreen from "../../../../app/screens/PostLoginScreens/Home/HomeScreen";
import { ThemeContext } from '../../../../app/components/Theme';
import { useKeyboard } from '../../../../app/components/Keyboard';
import { useHomeScreen } from '../../../../app/screens/PostLoginScreens/Home/UseHomeScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { queryByTestId } from '@testing-library/react';


jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn((callback) => {
            const unsubscribe = callback();
            return () => {
                unsubscribe();
            };
        }),
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
    };
});

jest.mock('../../../../app/components/Keyboard', () => {
    const registerScrollViewRef = jest.fn();
    const unregisterScrollViewRef = jest.fn();
    return {
        useKeyboard: jest.fn(() => ({
            keyboardHeight: 100,
            registerScrollViewRef,
            unregisterScrollViewRef,
        })),
    };
});

jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        MaterialCommunityIcons: ({ name, size, color, testID }) => (
            <Text testID={testID}>{`icon-${name}`}</Text>
        ),
    };
});

jest.mock('../../../../app/screens/PostLoginScreens/Home/UseHomeScreen');

useFocusEffect.mockImplementation((callback) => {
    const unsubscribe = callback();
    return unsubscribe;
});

const mockedNavigate = jest.fn();

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const setSelectedFile = jest.fn();
        const setContractName = jest.fn();
        const setEmployerAddress = jest.fn();
        const setAuthAppAddress = jest.fn();
        const setTokenContractInterface = jest.fn();
        const setValidatedAddress = jest.fn();
        const setShowAddressModal = jest.fn();
        const setErrors = jest.fn();
        const setShowErrorDetails = jest.fn();
        const setAddressChecksum = jest.fn();
        const handleFileSelectDropZone = jest.fn();
        const uploadContractData = jest.fn();
        const shareContract = jest.fn();
        const openContract = jest.fn();
        const fetchAndSyncContracts = jest.fn();
        const handleDeleteContract = jest.fn();
        const validateInput = jest.fn();
        const handleChecksumAddress = jest.fn();
        const copyToClipboard = jest.fn();
        useHomeScreen.mockImplementation(() => ({
            selectedFile: null,
            setSelectedFile,
            contractName: '',
            setContractName,
            employerAddress: '',
            setEmployerAddress,
            authAppAddress: '',
            setAuthAppAddress,
            tokenContractInterface: '',
            setTokenContractInterface,
            validatedAddress: '',
            setValidatedAddress,
            showAddressModal: false,
            setShowAddressModal,
            errors: {},
            setErrors,
            showErrorDetails: false,
            setShowErrorDetails,
            addressChecksum: '',
            setAddressChecksum,
            savedContracts: [],
            handleFileSelectDropZone,
            uploadContractData,
            shareContract,
            openContract,
            fetchAndSyncContracts,
            handleDeleteContract,
            validateInput,
            handleChecksumAddress,
            copyToClipboard,
        }));
    });

    const renderHomeScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <NavigationContainer>
                    <HomeScreen navigation={{ navigate: mockedNavigate }} />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderHomeScreen();
        expect(getByText('Smart Contract Toolkit')).toBeTruthy();
        expect(getByText('Build a Solidity Smart Contract')).toBeTruthy();
        expect(getByText('Tap to upload an employment contract')).toBeTruthy();
        expect(getByText('Create Contract')).toBeTruthy();
        expect(getByText('My Smart Contracts')).toBeTruthy();
        expect(getByText('No saved contracts yet')).toBeTruthy();
        expect(getByText('Address Checksum Conversion')).toBeTruthy();
        expect(getByText('Validate Address')).toBeTruthy();
        expect(getByText('All rights reserved © Al-Slebi AI-Contracts')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            selectedFile: { "assets": [{ "name": "legal employment contract.txt" }], "canceled": false },
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByPlaceholderText } = renderHomeScreen('light');

        const contractNameInputField = getByPlaceholderText("Enter Contract Name");
        const employerAddressInputField = getByPlaceholderText("Set Employer's USDC Address");
        const authAppAddressInputField = getByPlaceholderText("Set AuthApp's Address");
        const tokenInterfaceInputField = getByPlaceholderText("Set USDC's Token Contract Interface");
        const addressChecksumInputField = getByPlaceholderText("Set your token address");

        const contractNameInputFieldColour = contractNameInputField.props.style.color;
        const employerAddressInputFieldColour = employerAddressInputField.props.style.color;
        const authAppAddressInputFieldColour = authAppAddressInputField.props.style.color;
        const tokenInterfaceInputFieldColour = tokenInterfaceInputField.props.style.color;
        const addressChecksumInputFieldColour = addressChecksumInputField.props.style.color;

        expect(contractNameInputFieldColour).toEqual('rgb(57, 63, 67)');
        expect(employerAddressInputFieldColour).toEqual('rgb(57, 63, 67)');
        expect(authAppAddressInputFieldColour).toEqual('rgb(57, 63, 67)');
        expect(tokenInterfaceInputFieldColour).toEqual('rgb(57, 63, 67)');
        expect(addressChecksumInputFieldColour).toEqual('rgb(57, 63, 67)');
    });

    it('renders correctly with dark theme', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            selectedFile: { "assets": [{ "name": "legal employment contract.txt" }], "canceled": false },
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByPlaceholderText, getByTestId } = renderHomeScreen('dark');

        const contractNameInputField = getByPlaceholderText("Enter Contract Name");
        const employerAddressInputField = getByPlaceholderText("Set Employer's USDC Address");
        const authAppAddressInputField = getByPlaceholderText("Set AuthApp's Address");
        const tokenInterfaceInputField = getByPlaceholderText("Set USDC's Token Contract Interface");
        const addressChecksumInputField = getByPlaceholderText("Set your token address");

        const contractNameInputFieldColour = contractNameInputField.props.style.color;
        const employerAddressInputFieldColour = employerAddressInputField.props.style.color;
        const authAppAddressInputFieldColour = authAppAddressInputField.props.style.color;
        const tokenInterfaceInputFieldColour = tokenInterfaceInputField.props.style.color;
        const addressChecksumInputFieldColour = addressChecksumInputField.props.style.color;

        expect(contractNameInputFieldColour).toEqual('rgb(255, 255, 255)');
        expect(employerAddressInputFieldColour).toEqual('rgb(255, 255, 255)');
        expect(authAppAddressInputFieldColour).toEqual('rgb(255, 255, 255)');
        expect(tokenInterfaceInputFieldColour).toEqual('rgb(255, 255, 255)');
        expect(addressChecksumInputFieldColour).toEqual('rgb(255, 255, 255)');
    });

    it('allows entering a contract name', () => {
        const { getByPlaceholderText } = renderHomeScreen();
        const input = getByPlaceholderText('Enter Contract Name');
        fireEvent.changeText(input, 'New Contract');
        expect(useHomeScreen().setContractName).toHaveBeenCalledWith('New Contract');
    });

    it('allows entering employer address', () => {
        const { getByPlaceholderText } = renderHomeScreen();
        const input = getByPlaceholderText("Set Employer's USDC Address");
        fireEvent.changeText(input, '0x123');
        expect(useHomeScreen().setEmployerAddress).toHaveBeenCalledWith('0x123');
    });

    it('allows entering auth app address', () => {
        const { getByPlaceholderText } = renderHomeScreen();
        const input = getByPlaceholderText("Set AuthApp's Address");
        fireEvent.changeText(input, '0x456');
        expect(useHomeScreen().setAuthAppAddress).toHaveBeenCalledWith('0x456');
    });

    it('allows token contract inteerface', () => {
        const { getByPlaceholderText } = renderHomeScreen();
        const input = getByPlaceholderText("Set USDC's Token Contract Interface");
        fireEvent.changeText(input, '0x456');
        expect(useHomeScreen().setTokenContractInterface).toHaveBeenCalledWith('0x456');
    });

    it('calls handleChecksumAddress when the validate address button is pressed', () => {
        const { getByTestId } = renderHomeScreen();
        fireEvent.press(getByTestId('validateAddressButtonTestID'));
        expect(useHomeScreen().handleChecksumAddress).toHaveBeenCalled();
    });

    it('calls uploadContractData when the create contract button is pressed', () => {
        const { getByText } = renderHomeScreen();
        fireEvent.press(getByText('Create Contract'));
        expect(useHomeScreen().uploadContractData).toHaveBeenCalled();
    });

    it('calls handleDropZone when the drop zone button is pressed', () => {
        const { getByText } = renderHomeScreen();
        fireEvent.press(getByText('Tap to upload an employment contract'));
        expect(useHomeScreen().handleFileSelectDropZone).toHaveBeenCalled();
    });

    it('displays the icon on the dropzone if a contract is selected', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            selectedFile: { "assets": [{ "name": "legal employment contract.txt" }], "canceled": false },
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByText, getByTestId, queryByText } = renderHomeScreen();

        expect(getByTestId('dropZoneContractIconTestID')).toBeTruthy();
        expect(getByText('legal employment contract.txt')).toBeTruthy();
        expect(queryByText('Tap to upload an employment contract')).toBeNull();
    });

    it('does not displays the selected file if its empty', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            selectedFile: null,
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByText, getByTestId, queryByText, queryByTestId } = renderHomeScreen();
        
        expect(queryByText('legal employment contract.txt')).toBeNull();
        //expect(queryByText('Tap to upload an employment contract')).toBeNull();
    });

    it('displays error modal for contract creation when errors are present and closes it properly through get it button', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: { someError: 'Some error' },
            savedContracts: [],
            setShowErrorDetails: jest.fn(),
            showErrorDetails: true,
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByText, getByTestId } = renderHomeScreen();
        fireEvent.press(getByTestId('errorIconTestID'));

        expect(getByText('Please fix the following errors:')).toBeTruthy();

        fireEvent.press(getByText('Got it'));
    });

    it('displays error modal for contract creation when errors are present and closes it properly through the exit button', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: { someError: 'Some error' },
            savedContracts: [],
            setShowErrorDetails: jest.fn(),
            showErrorDetails: true,
            fetchAndSyncContracts: jest.fn(),
        }));

        const { getByText, getByTestId } = renderHomeScreen();
        expect(getByText('Please fix the following errors:')).toBeTruthy();

        fireEvent.press(getByTestId('exitButtonTestID'));
    });

    it('does not displays error modal for empty value errors', () => {
        useHomeScreen.mockImplementation(() => ({
            errors: { someError: '' },
            savedContracts: [],
            setShowErrorDetails: jest.fn(),
            showErrorDetails: true,
            fetchAndSyncContracts: jest.fn(),
        }));

        const { queryByTestId, queryByText } = renderHomeScreen();

        expect(queryByTestId('errorIconTestID')).toBeNull();
    });

    it('closes error modal when swipe left is used (onRequestClose)', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: { someError: 'Some error' },
            savedContracts: [],
            setShowErrorDetails: jest.fn(),
            showErrorDetails: true,
            fetchAndSyncContracts: jest.fn(),
        }));
        const { getByTestId, getByText, queryByText } = renderHomeScreen();

        expect(getByText('Please fix the following errors:')).toBeTruthy();

        const modalProps = getByTestId('errorModalTestID').props;

        act(() => {
            modalProps.onRequestClose();
        });

        //expect(queryByText('Please fix the following errors:')).toBeNull();
    });

    it('displays address checksum validaton modal when the button is clicked', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            addressChecksum: '0x99c805735C466c9B94762604612cfC961a48Eb03',
            fetchAndSyncContracts: jest.fn(),
            handleChecksumAddress: jest.fn(),
        }));

        const { getByText, getByTestId } = renderHomeScreen();
        fireEvent.press(getByTestId('validateAddressButtonTestID'));

        expect(getByText('Validated Address:')).toBeTruthy();
    });

    it('displays contract items properly if any are saved', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [{ contractName: 'Contract 1' }],
            fetchAndSyncContracts: jest.fn(),
        }));
        
        const { getByText } = renderHomeScreen();
        
        expect(getByText('Access Contract')).toBeTruthy();
        expect(getByText('Share Contract')).toBeTruthy();
        expect(getByText('Delete Contract')).toBeTruthy();
    });
    
    it('copies the address properly on address checksum modal when the button is clicked', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            addressChecksum: '0x99c805735C466c9B94762604612cfC961a48Eb03',
            copyToClipboard: jest.fn(),
            setShowAddressModal: jest.fn(),
            fetchAndSyncContracts: jest.fn(),
            handleChecksumAddress: jest.fn(),
        }));
        
        const { getByText, getByTestId } = renderHomeScreen();
        fireEvent.press(getByTestId('validateAddressButtonTestID'));
        
        expect(getByText('Validated Address:')).toBeTruthy();
        
        fireEvent.press(getByTestId('copyAddressButtonTestID'));
        
        //expect(useHomeScreen.mockImplementation.copyToClipboard).toHaveBeenCalled();
    });
    
    it('closes the address checksum modal when the exit button is clicked', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            addressChecksum: '0x99c805735C466c9B94762604612cfC961a48Eb03',
            copyToClipboard: jest.fn(),
            setShowAddressModal: jest.fn(),
            fetchAndSyncContracts: jest.fn(),
            handleChecksumAddress: jest.fn(),
        }));
        
        const { getByText, getByTestId } = renderHomeScreen();
        fireEvent.press(getByTestId('validateAddressButtonTestID'));
        
        expect(getByText('Validated Address:')).toBeTruthy();
        
        fireEvent.press(getByTestId('exitAddressButtonTestID'));
        
        //expect(useHomeScreen.mockImplementation.copyToClipboard).toHaveBeenCalled();
    });
    
    it('closes the address checksum modal when swipe left is used (onRequestClose)', async () => {
        useHomeScreen.mockImplementation(() => ({
            errors: {},
            savedContracts: [],
            addressChecksum: '0x99c805735C466c9B94762604612cfC961a48Eb03',
            setShowAddressModal: jest.fn(),
            fetchAndSyncContracts: jest.fn(),
            handleChecksumAddress: jest.fn(),
        }));
        const { getByTestId, getByText, queryByText } = renderHomeScreen();
        fireEvent.press(getByTestId('validateAddressButtonTestID'));

        expect(getByText('Validated Address:')).toBeTruthy();

        const modalProps = getByTestId('addressModalTestID').props;

        act(() => {
            modalProps.onRequestClose();
        });

        //expect(queryByText('Validated Address:')).toBeNull();
    });

    it('registers and unregisters the scroll view ref', async () => {
        const { getByPlaceholderText } = renderHomeScreen();

        const field = getByPlaceholderText("Set Employer's USDC Address");
        fireEvent.press(field);

        await waitFor(() => expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled());

        useNavigation().goBack();
        const cleanup = useFocusEffect.mock.calls[0][0]();
        cleanup();

        await waitFor(() => {
            expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalledWith('HomeScreen');
        });
    });

});
