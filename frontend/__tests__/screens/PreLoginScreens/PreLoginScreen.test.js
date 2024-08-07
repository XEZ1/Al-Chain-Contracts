import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import PreLoginScreen from '../../../app/screens/PreLoginScreens/PreLoginScreen';
import { ThemeContext } from '../../../app/components/Theme';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('../../../app/styles/GloballySharedStyles', () => () => ({
    centeredViewContainer: {},
    button: {},
    generalText: {},
    boldMediumText: {}
}));

jest.mock('../../../app/styles/LocallySharedStylesPreLoginScreens', () => () => ({
    localButtonContainer: {}
}));

const mockNavigate = jest.fn();

describe('PreLoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderPreLoginScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <PreLoginScreen navigation={{ navigate: mockNavigate }} />
            </ThemeContext.Provider>
        );
    };

    it('renders correctly with light theme', () => {
        const { getByText } = renderPreLoginScreen();

        expect(getByText('Login')).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
        expect(getByText('About Us')).toBeTruthy();
    });

    it('navigates to Login on button press', () => {
        const { getByText } = renderPreLoginScreen();

        fireEvent.press(getByText('Login'));
        expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    it('navigates to SignUp on button press', () => {
        const { getByText } = renderPreLoginScreen();

        fireEvent.press(getByText('Sign Up'));
        expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    });

    it('navigates to AboutUs on button press', () => {
        const { getByText } = renderPreLoginScreen();

        fireEvent.press(getByText('About Us'));
        expect(mockNavigate).toHaveBeenCalledWith('AboutUs');
    });
});
