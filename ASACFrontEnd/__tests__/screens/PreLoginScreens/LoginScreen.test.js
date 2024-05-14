import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../../app/screens/PreLoginScreens/LoginScreen';
import { ThemeContext } from '../../../app/components/Theme';
import { AuthContext } from '../../../app/components/Authentication';
import { KeyboardContext } from '../../../app/components/Keyboard';
import { useFocusEffect } from '@react-navigation/native';


const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn()
    };
});

useFocusEffect.mockImplementation((callback) => {
    const unsubscribe = callback();
    return unsubscribe;
});

const mockHandleLogin = jest.fn();
const mockRegisterScrollViewRef = jest.fn();
const mockUnregisterScrollViewRef = jest.fn();

const wrapper = (theme = 'light') => ({ children }) => (
    <ThemeContext.Provider value={{ theme }}>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
            <KeyboardContext.Provider value={{
                keyboardHeight: 0,
                registerScrollViewRef: mockRegisterScrollViewRef,
                unregisterScrollViewRef: mockUnregisterScrollViewRef
            }}>
                {children}
            </KeyboardContext.Provider>
        </AuthContext.Provider>
    </ThemeContext.Provider>
);

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('light') });

        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByPlaceholderText } = render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('light') });
    
        const usernameInput = getByPlaceholderText('Username');
        const color = usernameInput.props.style.color;

        expect(color).toEqual('rgb(57, 63, 67)');
    });
    
    it('renders correctly with dark theme', () => {
        const { getByPlaceholderText } = render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('dark') });
    
        const usernameInput = getByPlaceholderText('Username');
        const color = usernameInput.props.style.color;
       
        expect(color).toEqual('rgb(255, 255, 255)');
    });

    it('handles text input changes', () => {
        const { getByPlaceholderText } = render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('light') });

        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password');
    });

    it('submits credentials on button press', async () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('light') });
    
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

    it('registers and unregisters keyboard on focus', () => {
        let cleanupFunction;
        useFocusEffect.mockImplementation((callback) => {
            cleanupFunction = callback();
            return () => {
                cleanupFunction();
            };
        });
    
        render(<LoginScreen navigation={{ navigate: mockedNavigate }} />, { wrapper: wrapper('light') });
    
        cleanupFunction();
    
        expect(mockRegisterScrollViewRef).toHaveBeenCalledTimes(1);
        expect(mockUnregisterScrollViewRef).toHaveBeenCalledTimes(1);
    });
    
    
});
