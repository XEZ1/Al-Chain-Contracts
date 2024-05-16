import React from 'react';
import { render, fireEvent, act, waitFor, focus, debug } from '@testing-library/react-native';
import SignUpScreen from '../../../app/screens/PreLoginScreens/SignUpScreen';
import { AuthContext } from '../../../app/components/Authentication';
import { ThemeContext } from '../../../app/components/Theme';
import { useKeyboard } from '../../../app/components/Keyboard';
import PreLoginStack from '../../../app/navigation/PreLoginStack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';


jest.useFakeTimers();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn((callback) => {
            const unsubscribe = callback();
            return () => {
                console.log('Cleanup called');
                unsubscribe();
            };
        }),
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
    };
});

jest.mock('../../../app/components/Keyboard', () => {
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

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        ViewPagerAndroid: View,
        DrawerLayout: View,
        WebView: View,
        SafeAreaView: View,
        FlatList: View,
        SectionList: View,
        GestureHandlerRootView: View,
        PanGestureHandler: View,
        Directions: {},
    };
});

describe('SignUpScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const handleSignUp = jest.fn((username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors) => {
        setErrors({
            username: 'Username is required',
            firstName: 'First name is required',
            lastName: 'Last name is required',
            email: 'Email is invalid',
        });
    });
    const authContextValue = {
        handleSignUp,
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        handleLogin: jest.fn(),
    };

    const renderComponent = (theme = 'light') => {
        return render(
            <AuthContext.Provider value={authContextValue}>
                <ThemeContext.Provider value={{ theme }}>
                    <SignUpScreen />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
    };

    const renderComponentWithNavigation = () => {
        return render(
            <AuthContext.Provider value={authContextValue}>
                <ThemeContext.Provider value={'light'}>
                    <NavigationContainer>
                        <PreLoginStack />
                    </NavigationContainer>
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = renderComponent();

        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('First Name')).toBeTruthy();
        expect(getByPlaceholderText('Last Name')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByPlaceholderText } = renderComponent('light');
    
        const usernameInput = getByPlaceholderText('Username');
        const color = usernameInput.props.style.color;

        expect(color).toEqual('rgb(57, 63, 67)');
    });
    
    it('renders correctly with dark theme', () => {
        const { getByPlaceholderText } = renderComponent('dark');
    
        const usernameInput = getByPlaceholderText('Username');
        const color = usernameInput.props.style.color;
       
        expect(color).toEqual('rgb(255, 255, 255)');
    });

    it('does not show error modal when there are no errors', () => {
        const { queryByTestId } = renderComponent();
        expect(queryByTestId('error-icon-container')).toBeNull();
    });

    it('shows error modal when errors exist and icon is pressed', async () => {
        const { getByTestId, getByText, findByTestId, getByPlaceholderText } = renderComponent();

        fireEvent.changeText(getByPlaceholderText('Username'), '');
        fireEvent.changeText(getByPlaceholderText('First Name'), '');
        fireEvent.changeText(getByPlaceholderText('Last Name'), '');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456789A!!!');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456789A!!!');

        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(findByTestId('error-icon-container')).toBeTruthy();
        });

        fireEvent.press(getByTestId('error-icon-container'));
        expect(getByText('Please fix the following errors:')).toBeTruthy();
    });

    it('closes error modal when got it button is pressed', async () => {
        const { getByTestId, getByText, getByPlaceholderText, findByTestId, queryByText } = renderComponent();

        fireEvent.changeText(getByPlaceholderText('Username'), '');
        fireEvent.changeText(getByPlaceholderText('First Name'), '');
        fireEvent.changeText(getByPlaceholderText('Last Name'), '');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456789A!!!');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456789A!!!');

        fireEvent.press(getByText('Sign Up'));
        await waitFor(() => {
            expect(findByTestId('error-icon-container')).toBeTruthy();
        });

        
        fireEvent.press(getByTestId('error-icon-container'));
        expect(getByText('Please fix the following errors:')).toBeTruthy();

        
        fireEvent.press(getByText('Got it'));
        expect(queryByText('Please fix the following errors:')).toBeNull();
    });

    it('closes error modal when close circle button is pressed', async () => {
        const { getByTestId, getByText, getByPlaceholderText, findByTestId, queryByText } = renderComponent();

        fireEvent.changeText(getByPlaceholderText('Username'), '');
        fireEvent.changeText(getByPlaceholderText('First Name'), '');
        fireEvent.changeText(getByPlaceholderText('Last Name'), '');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456789A!!!');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456789A!!!');

        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(findByTestId('error-icon-container')).toBeTruthy();
        });

        fireEvent.press(getByTestId('error-icon-container'));
        expect(getByText('Please fix the following errors:')).toBeTruthy();

        fireEvent.press(getByTestId('closeModalButton'));
        expect(queryByText('Please fix the following errors:')).toBeNull();
    });

    it('closes error modal when swiped left is used (onRequestClose)', async () => {
        const { getByTestId, getByText, getByPlaceholderText, findByTestId, queryByText } = renderComponent();

        fireEvent.changeText(getByPlaceholderText('Username'), '');
        fireEvent.changeText(getByPlaceholderText('First Name'), '');
        fireEvent.changeText(getByPlaceholderText('Last Name'), '');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), '123456789A!!!');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456789A!!!');

        fireEvent.press(getByText('Sign Up'));

        await waitFor(() => {
            expect(findByTestId('error-icon-container')).toBeTruthy();
        });

        fireEvent.press(getByTestId('error-icon-container'));
        expect(getByText('Please fix the following errors:')).toBeTruthy();

        const modalProps = getByTestId('error-modal').props;

        act(() => {
            modalProps.onRequestClose();
        });

        expect(queryByText('Please fix the following errors:')).toBeNull();
    });

    it('calls handleSignUp with correct parameters', () => {
        const { getByPlaceholderText, getByText } = renderComponent();

        fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('First Name'), 'Test');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'User');
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

        fireEvent.press(getByText('Sign Up'));

        expect(handleSignUp).toHaveBeenCalledWith(
            'testuser',
            'Test',
            'User',
            'test@example.com',
            'password123',
            'password123',
            {},
            expect.any(Function)
        );
    });

    it('registers and unregisters the scroll view ref', async () => {
        const { findByText } = renderComponentWithNavigation();

        const signUpButton = await findByText('Sign Up');
        fireEvent.press(signUpButton);

        await waitFor(() => expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled());
        
        useNavigation().goBack(); 
        const cleanup = useFocusEffect.mock.calls[0][0]();
        cleanup();
        
        await waitFor(() => {
            expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalledWith('SignUpScreen');
        });
    });

});
