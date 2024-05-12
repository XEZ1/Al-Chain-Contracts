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
    it('should render all initial screens correctly', async () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <PreLoginStack />
            </NavigationContainer>
        );

        expect(await getByTestId('PreLoginTestID')).toBeTruthy();
        expect(await getByTestId('LoginTestID')).toBeTruthy();
        expect(await getByTestId('SignUpTestID')).toBeTruthy();
    });
});

