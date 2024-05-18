import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../../../app/screens/PostLoginScreens/Settings/SettingsScreen';
import { ThemeContext } from '../../../../app/components/Theme';
import { AuthContext } from '../../../../app/components/Authentication';
import { useSettingsScreen } from '../../../../app/screens/PostLoginScreens/Settings/UseSettingsScreen';


jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
    };
});

jest.mock('../../../../app/screens/PostLoginScreens/Settings/UseSettingsScreen', () => {
    const toggleNotifications = jest.fn();
    const setNotificationsEnabled = jest.fn();
    return {
        useSettingsScreen: () => ({
            notificationsEnabled: false,
            setNotificationsEnabled,
            toggleNotifications
        })
    };
});

describe('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockNavigate = jest.fn();
    const mockSetIsLoggedIn = jest.fn();
    const mockHandleLogout = jest.fn();

    const authContextValue = {
        isLoggedIn: true,
        setIsLoggedIn: mockSetIsLoggedIn,
        handleLogout: mockHandleLogout
    };

    const themeContextValue = {
        theme: 'light',
        toggleTheme: jest.fn(),
        isDarkMode: false
    };

    const renderSettingsScreen = (theme = 'light') => {
        return render(
            <AuthContext.Provider value={authContextValue}>
                <ThemeContext.Provider value={themeContextValue}>
                    <SettingsScreen navigation={{ navigate: mockNavigate }} />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderSettingsScreen();

        expect(getByText('Settings')).toBeTruthy();
        expect(getByText('Dark Mode')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();
    });

    it('toggles dark mode', () => {
        const { getByTestId } = renderSettingsScreen();

        fireEvent(getByTestId('darkModeSwitchTestID'), 'onValueChange', !useSettingsScreen().notificationsEnabled);
        expect(themeContextValue.toggleTheme).toHaveBeenCalled();
    });

    it('toggles notifications', () => {
        const { getByTestId } = renderSettingsScreen();

        fireEvent(getByTestId('notificationsSwitchTestID'), 'onValueChange', true);
        expect(useSettingsScreen().toggleNotifications).toHaveBeenCalled();
    });

    it('handles log out properly', () => {
        const { getByText } = renderSettingsScreen();

        const logoutButton = getByText('Log Out');
        fireEvent.press(logoutButton);

        expect(mockHandleLogout).toHaveBeenCalled();
    });
});
