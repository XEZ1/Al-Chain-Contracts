import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AboutUsScreen from '../../../app/screens/PreLoginScreens/AboutUsScreen';
import { ThemeContext } from '../../../app/components/Theme';
import { useFocusEffect } from '@react-navigation/native';
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

useFocusEffect.mockImplementation((callback) => {
    const unsubscribe = callback();
    return unsubscribe;
});

describe('AboutUsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockedNavigate = jest.fn();

    const renderAboutUsScreen = (theme = 'light') => {
        return render(            
            <ThemeContext.Provider value={{ theme }}>
                <AboutUsScreen navigation={{ navigate: mockedNavigate }} />
            </ThemeContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderAboutUsScreen();

        expect(getByText('About AI-Chain-Contracts')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByText } = renderAboutUsScreen('light');

        const text = getByText('About AI-Chain-Contracts');
        const colour = text.props.style.color;

        expect(colour).toEqual('rgb(57, 63, 67)');
    });

    it('renders correctly with dark theme', () => {
        const { getByText } = renderAboutUsScreen('dark');;

        const text = getByText('About AI-Chain-Contracts');
        const colour = text.props.style.color;

        expect(colour).toEqual('rgb(255, 255, 255)');
    });
});
