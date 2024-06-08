import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SupportScreen from "../../../../app/screens/PostLoginScreens/Support/SupportScreen";
import { ThemeContext } from '../../../../app/components/Theme';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../../../app/components/Keyboard';
import { useNavigation } from '@react-navigation/native';
import getGloballySharedStyles from '../../../../app/styles/GloballySharedStyles';


jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn((callback) => {
            const unsubscribe = callback();
            return () => {
                unsubscribe();
            };
        }),
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
    };
});

jest.mock('../../../../app/components/Keyboard', (keyboardHeight = 0) => {
    const registerScrollViewRef = jest.fn();
    const unregisterScrollViewRef = jest.fn();
    return {
        useKeyboard: jest.fn(() => ({
            keyboardHeight: keyboardHeight,
            registerScrollViewRef,
            unregisterScrollViewRef,
        })),
    };
});

useFocusEffect.mockImplementation((callback) => {
    const unsubscribe = callback();
    return unsubscribe;
});

const mockedNavigate = jest.fn();

describe('SupportScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    sharedStyles = getGloballySharedStyles();

    const renderSupportScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <SupportScreen navigation={{ navigate: mockedNavigate }} />
            </ThemeContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderSupportScreen();

        expect(getByText('Send')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByTestId } = renderSupportScreen('light');

        const inputTextField = getByTestId('inputTextFieldTestID');
        const colour = inputTextField.props.placeholderTextColor;

        expect(colour).toEqual('darkgrey');
    });

    it('renders correctly with dark theme', () => {
        const { getByTestId } = renderSupportScreen('dark');;

        const inputTextField = getByTestId('inputTextFieldTestID');
        const colour = inputTextField.props.placeholderTextColor;

        expect(colour).toEqual('grey');
    });

    it('registers and unregisters the scroll view ref', async () => {
        const { findByText } = renderSupportScreen();

        const sendButton = await findByText('Send');
        fireEvent.press(sendButton);

        await waitFor(() => expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled());

        useNavigation().goBack();
        const cleanup = useFocusEffect.mock.calls[0][0]();
        cleanup();

        await waitFor(() => {
            expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalledWith('SupportScreen');
        });
    });

    it('handles message sending', () => {
        const { getByText, getByTestId, getByPlaceholderText } = renderSupportScreen();
        const input = getByTestId('inputTextFieldTestID');
        const sendButton = getByText('Send');

        fireEvent.changeText(input, 'New message');
        fireEvent.press(sendButton);

        expect(input.props.value).toBe('');
    });

    it('applies correct styles for assistant and user messages after sending a message', () => {
        const { getByTestId, getByText, getAllByTestId } = renderSupportScreen();

        const input = getByTestId('inputTextFieldTestID');
        fireEvent.changeText(input, 'I need help with my account.');
        fireEvent.press(getByText('Send'));

        const messageViews = getAllByTestId(/messageView-/i);
        expect(messageViews.length).toBe(2);

        const consolidateStyles = (styleArray) => {
            return styleArray.reduce((acc, styles) => ({ ...acc, ...styles }), {});
        };

        const assistantStyle = consolidateStyles(messageViews[0].props.style);
        expect(assistantStyle.alignSelf).toEqual('flex-start');

        const userStyle = consolidateStyles(messageViews[1].props.style);
        expect(userStyle.alignSelf).toEqual('flex-end');
    });

    it('sets viewPaddingBottom to "120%" when keyboard is hidden', () => {
        const { getByTestId } = renderSupportScreen();
        const flattenStyle = (style) => {
            if (Array.isArray(style)) {
                return style.reduce((acc, styles) => ({ ...acc, ...styles }), {});
            }
            return style;
        };

        const scrollView = getByTestId('viewTestID');
        const flattenedStyle = flattenStyle(scrollView.props.style);
        expect(flattenedStyle.paddingTop).toBe('120%');
    });
});
