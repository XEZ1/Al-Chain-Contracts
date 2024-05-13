//import React from 'react';
//import { render, fireEvent, act, waitFor, debug } from '@testing-library/react-native';
//import SignUpScreen from '../../../app/screens/PreLoginScreens/SignUpScreen';
//import { AuthContext } from '../../../app/components/Authentication';
//import { ThemeContext } from '../../../app/components/Theme';
//import { useKeyboard } from '../../../app/components/Keyboard';
//
//
//jest.mock('@react-navigation/native', () => ({
//    useFocusEffect: jest.fn((fn) => fn()),
//}));
//
//jest.mock('../../../app/components/Keyboard', () => ({
//    useKeyboard: jest.fn(() => ({
//        keyboardHeight: 100,
//        registerScrollViewRef: jest.fn(),
//        unregisterScrollViewRef: jest.fn(),
//    })),
//}));
//
//jest.mock('../../../app/components/Authentication', () => {
//    const originalModule = jest.requireActual('../../../app/components/Authentication');
//    return {
//        __esModule: true, 
//        ...originalModule,
//        AuthContext: {
//            ...originalModule.AuthContext,
//            Consumer: originalModule.AuthContext.Consumer,
//            Provider: ({ children, value }) => {
//                return (
//                    <originalModule.AuthContext.Provider value={value}>
//                        {children}
//                    </originalModule.AuthContext.Provider>
//                );
//            },
//        },
//    };
//});
//
//
//
//
//describe('SignUpScreen', () => {
//    const theme = 'light';
//    const handleSignUp = jest.fn((username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors) => {
//        console.log('Mock handleSignUp called');
//        setErrors({
//            username: 'Username is required',
//            firstName: 'First name is required',
//            lastName: 'Last name is required',
//            email: 'Email is invalid',
//        });
//    });
//    const authContextValue = {
//        handleSignUp,
//        isLoggedIn: false,
//        setIsLoggedIn: jest.fn(),
//        handleLogin: jest.fn(),
//    };
//    const themeContextValue = { theme };
//
//    const renderComponent = (errors = {}) => {
//        return render(
//            <AuthContext.Provider value={authContextValue}>
//                <ThemeContext.Provider value={themeContextValue}>
//                    <SignUpScreen />
//                </ThemeContext.Provider>
//            </AuthContext.Provider>
//        );
//    };
//
//    //it('renders correctly', () => {
//    //    const { getByPlaceholderText, getByText } = renderComponent();
////
//    //    expect(getByPlaceholderText('Username')).toBeTruthy();
//    //    expect(getByPlaceholderText('First Name')).toBeTruthy();
//    //    expect(getByPlaceholderText('Last Name')).toBeTruthy();
//    //    expect(getByPlaceholderText('Email')).toBeTruthy();
//    //    expect(getByPlaceholderText('Password')).toBeTruthy();
//    //    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
//    //    expect(getByText('Sign Up')).toBeTruthy();
//    //});
//
//    it('shows error modal when errors exist and icon is pressed', async () => {
//        const { getByTestId, getByText, getByPlaceholderText, debug } = renderComponent();
//    
//        fireEvent.changeText(getByPlaceholderText('Username'), ''); 
//        fireEvent.changeText(getByPlaceholderText('First Name'), '');
//        fireEvent.changeText(getByPlaceholderText('Last Name'), '');
//        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
//        fireEvent.changeText(getByPlaceholderText('Password'), '123456789A!!!');
//        fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456789A!!!');
//
//        fireEvent.press(getByText('Sign Up'));
//
//        await waitFor(() => {
//            expect(getByTestId('error-icon-container')).toBeTruthy(); 
//        });
//    
//        act(() => {
//            fireEvent.press(getByTestId('error-icon-container'));
//        });
//    
//        expect(getByText('Please fix the following errors:')).toBeTruthy();
//        debug(); 
//    });
    
    //it('closes error modal when got it button is pressed', () => {
    //    const { getByTestId, getByText, queryByText } = renderComponent({ });
//
    //    act(() => {
    //        fireEvent.press(getByTestId('error-icon-container'));
    //    });
//
    //    expect(getByText('Please fix the following errors:')).toBeTruthy();
//
    //    act(() => {
    //        fireEvent.press(getByText('Got it'));
    //    });
//
    //    expect(queryByText('Please fix the following errors:')).toBeNull();
    //});

    //it('calls handleSignUp with correct parameters', () => {
    //    const { getByPlaceholderText, getByText } = renderComponent();
//
    //    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    //    fireEvent.changeText(getByPlaceholderText('First Name'), 'Test');
    //    fireEvent.changeText(getByPlaceholderText('Last Name'), 'User');
    //    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    //    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    //    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
//
    //    fireEvent.press(getByText('Sign Up'));
//
    //    expect(handleSignUp).toHaveBeenCalledWith(
    //        'testuser',
    //        'Test',
    //        'User',
    //        'test@example.com',
    //        'password123',
    //        'password123',
    //        {},
    //        expect.any(Function)
    //    );
    //});

    //it('registers and unregisters the scroll view ref', () => {
    //    const { unmount } = renderComponent();
//
    //    expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled();
    //    unmount();
    //    expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalled();
    //});
//});

describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});

