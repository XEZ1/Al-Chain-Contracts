import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../../app/navigation/AppNavigator';
import { AuthContext } from '../../app/components/Authentication';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../app/components/Theme';
import { jest } from '@jest/globals';


jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => <div>{children}</div>,
    useSafeAreaInsets: () => ({
        top: 0, bottom: 0, left: 0, right: 0
    }),
    useSafeAreaFrame: () => ({
        x: 0, y: 0, widghth: 0, height: 0
    }),
}));

jest.mock('@react-navigation/bottom-tabs', () => {
    const actualNav = jest.requireActual('@react-navigation/bottom-tabs');
    return {
        createBottomTabNavigator: () => actualNav.createBottomTabNavigator(),
    };
});

jest.mock('@react-navigation/stack', () => {
    const actualStack = jest.requireActual('@react-navigation/stack');
    return {
        createStackNavigator: () => actualStack.createStackNavigator(),
    };
});

jest.mock('../../app/navigation/PostLoginTabs', () => (props) => <div {...props}>PostLoginTabs</div>);

jest.mock('../../app/navigation/PreLoginStack', () => (props) => <div {...props}>PreLoginStack</div>);

describe('AppNavigator', () => {
    const setIsLoggedIn = jest.fn();

    const renderAppNavigator = (isLoggedIn, theme = 'light') => {
        return render(
            <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                <ThemeContext.Provider value={{ theme }}>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('renders PostLoginTabs when isLoggedIn is true', async () => {
        const { findByTestId, debug } = renderAppNavigator(true);
        debug();
        expect(await findByTestId('postLoginTabsTestID')).not.toBeNull();
    });

    it('renders PreLoginStack when isLoggedIn is false', async () => {
        const { findByTestId, debug } = renderAppNavigator(false);
        debug();
        expect(await findByTestId('preLoginStackTestID')).not.toBeNull();
    });
});
