import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import PreLoginStack from '../../app/navigation/PreLoginStack';


jest.mock('@react-navigation/stack', () => {
    const actualNav = jest.requireActual('@react-navigation/stack');
    return {
        ...actualNav,
        createStackNavigator: () => ({
            Navigator: ({ children }) => <div>{children}</div>,
            Screen: ({ name, component }) => <div testID={`${name}TestID`}>{name}</div>
        }),
    };
});

describe('PreLoginStack', () => {
    const renderPreLoginStack = () => {
        return render(
            <NavigationContainer>
                <PreLoginStack />
            </NavigationContainer>
        );
    };

    it('should render all screens correctly', () => {
        const { getByTestId } = renderPreLoginStack();

        expect(getByTestId('PreLoginTestID')).toBeTruthy();
        expect(getByTestId('LoginTestID')).toBeTruthy();
        expect(getByTestId('SignUpTestID')).toBeTruthy();
        expect(getByTestId('AboutUsTestID')).toBeTruthy();
    });
});

