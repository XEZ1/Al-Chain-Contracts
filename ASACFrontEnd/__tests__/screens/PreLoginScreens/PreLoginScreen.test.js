import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import PreLoginScreen from '../../app/screens/PreLoginScreens/PreLoginScreen';
import { ThemeContext } from '../../app/components/Theme';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('../../app/styles/GloballySharedStyles', () => () => ({
    centeredViewContainer: {},
    button: {},
    generalText: {},
    boldMediumText: {}
}));

jest.mock('../../app/styles/LocallySharedStylesPreLoginScreens', () => () => ({
    localButtonContainer: {}
}));

const mockNavigate = jest.fn();
const mockTheme = 'light';

describe('PreLoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const wrapper = ({ children }) => (
        <ThemeContext.Provider value={{ theme: mockTheme }}>
            {children}
        </ThemeContext.Provider>
    );

    it('renders correctly with light theme', () => {
        const { getByText } = render(<PreLoginScreen navigation={{ navigate: mockNavigate }} />, { wrapper });

        expect(getByText('Login')).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
        expect(getByText('About Us')).toBeTruthy();
    });

    it('navigates to Login on button press', () => {
        const { getByText } = render(<PreLoginScreen navigation={{ navigate: mockNavigate }} />, { wrapper });

        fireEvent.press(getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    it('navigates to SignUp on button press', () => {
        const { getByText } = render(<PreLoginScreen navigation={{ navigate: mockNavigate }} />, { wrapper });

        fireEvent.press(getByText('Sign Up'));
        expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    });

    it('About Us button press does nothing', () => {
        const { getByText } = render(<PreLoginScreen navigation={{ navigate: mockNavigate }} />, { wrapper });

        fireEvent.press(getByText('About Us'));
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
