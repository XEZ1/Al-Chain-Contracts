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
            Screen: ({ name, component }) => <div testID={`screen-${name}`}>{name}</div>
        }),
    };
});

describe('PreLoginStack', () => {
    it('should render all initial screens correctly', async () => {
        const { findByTestId, debug } = render(
            <NavigationContainer>
                <PreLoginStack />
            </NavigationContainer>
        );
        //debug()

        expect(await findByTestId('screen-PreLogin')).toBeTruthy();
        expect(await findByTestId('screen-Login')).toBeTruthy();
        expect(await findByTestId('screen-SignUp')).toBeTruthy();
    });
});

