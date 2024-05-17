import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../../app/screens/PreLoginScreens/LoginScreen';
import { ThemeContext } from '../../../app/components/Theme';
import { AuthContext } from '../../../app/components/Authentication';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../../app/components/Keyboard';
import { useNavigation } from '@react-navigation/native';


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

useFocusEffect.mockImplementation((callback) => {
    const unsubscribe = callback();
    return unsubscribe;
});

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockedNavigate = jest.fn();
    const mockRegisterScrollViewRef = jest.fn();
    const mockUnregisterScrollViewRef = jest.fn();
    const mockHandleLogin = jest.fn();

    const authContextValue = {
        handleLogin: mockHandleLogin,
        handleSignUp: jest.fn(),
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
    };

    const renderLoginScreen = (theme = 'light') => {
        return render(
            <AuthContext.Provider value={authContextValue}>
                <ThemeContext.Provider value={{ theme }}>
                        <LoginScreen navigation={{ navigate: mockedNavigate }} />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = renderLoginScreen();

        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByPlaceholderText } = renderLoginScreen();

        const usernameInput = getByPlaceholderText('Username');
        const colour = usernameInput.props.style.color;

        expect(colour).toEqual('rgb(57, 63, 67)');
    });

    it('renders correctly with dark theme', () => {
        const { getByPlaceholderText } = renderLoginScreen('dark');;

        const usernameInput = getByPlaceholderText('Username');
        const colour = usernameInput.props.style.color;

        expect(colour).toEqual('rgb(255, 255, 255)');
    });

    it('handles text input changes', () => {
        const { getByPlaceholderText } = renderLoginScreen();

        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password');
    });

    it('submits credentials on button press', async () => {
        const { getByText, getByPlaceholderText } = renderLoginScreen();

        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Login');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password');

        await waitFor(() => {
            fireEvent.press(loginButton);
        });

        expect(mockHandleLogin).toHaveBeenCalledWith('testuser', 'password');
    });

    it('registers and unregisters the scroll view ref', async () => {
        const { findByText } = renderLoginScreen();

        const loginButton = await findByText('Login');
        fireEvent.press(loginButton);

        await waitFor(() => expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled());
        
        useNavigation().goBack(); 
        const cleanup = useFocusEffect.mock.calls[0][0]();
        cleanup();
        
        await waitFor(() => {
            expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalledWith('LoginScreen');
        });
    });
});
