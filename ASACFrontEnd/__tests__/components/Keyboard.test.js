import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Keyboard, Dimensions, TextInput } from 'react-native';
import { KeyboardProvider, useKeyboard } from './KeyboardProvider';


jest.mock('react-native', () => ({
    ...jest.requireActual('react-native'),
    Keyboard: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
    },
    Dimensions: {
        get: jest.fn(() => ({
            height: 800,
        })),
    },
    TextInput: {
        State: {
            currentlyFocusedInput: jest.fn(),
        },
    },
}));

const MockComponent = () => {
    const { keyboardHeight, isKeyboardVisible, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();
    return (
        <>
            <Text>Keyboard Height: {keyboardHeight}</Text>
            <Text>Is Keyboard Visible: {isKeyboardVisible ? 'Yes' : 'No'}</Text>
        </>
    );
};

describe('KeyboardProvider', () => {
    let keyboardDidShowListener;
    let keyboardDidHideListener;

    beforeEach(() => {
        keyboardDidShowListener = jest.fn();
        keyboardDidHideListener = jest.fn();
        Keyboard.addListener.mockImplementation((event, callback) => {
            if (event === 'keyboardDidShow') {
                keyboardDidShowListener = callback;
            } else if (event === 'keyboardDidHide') {
                keyboardDidHideListener = callback;
            }
            return { remove: jest.fn() };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should provide default context values', () => {
        const { getByText } = render(
            <KeyboardProvider>
                <MockComponent />
            </KeyboardProvider>
        );

        expect(getByText(/Keyboard Height: 0/i)).toBeTruthy();
        expect(getByText(/Is Keyboard Visible: No/i)).toBeTruthy();
    });

    it('should update context values on keyboard show and hide', () => {
        const { getByText } = render(
            <KeyboardProvider>
                <MockComponent />
            </KeyboardProvider>
        );

        const endCoordinates = { screenY: 600 };

        fireEvent(keyboardDidShowListener, { endCoordinates });

        expect(getByText(/Keyboard Height: 110/i)).toBeTruthy();
        expect(getByText(/Is Keyboard Visible: Yes/i)).toBeTruthy();

        fireEvent(keyboardDidHideListener);

        expect(getByText(/Keyboard Height: 0/i)).toBeTruthy();
        expect(getByText(/Is Keyboard Visible: No/i)).toBeTruthy();
    });

    it('should register and unregister scroll view refs', () => {
        const scrollViewRef = { current: { getScrollResponder: jest.fn(() => ({ scrollResponderScrollNativeHandleToKeyboard: jest.fn() })) } };
        const { result } = renderHook(() => useKeyboard(), {
            wrapper: ({ children }) => <KeyboardProvider>{children}</KeyboardProvider>,
        });

        act(() => {
            result.current.registerScrollViewRef('scrollView1', scrollViewRef);
        });

        expect(result.current.scrollViewRefs.current.get('scrollView1')).toBe(scrollViewRef);

        act(() => {
            result.current.unregisterScrollViewRef('scrollView1');
        });

        expect(result.current.scrollViewRefs.current.get('scrollView1')).toBeUndefined();
    });

    it('should handle scrolling to the currently focused input', () => {
        const scrollViewRef = { current: { getScrollResponder: jest.fn(() => ({ scrollResponderScrollNativeHandleToKeyboard: jest.fn() })) } };
        const nodeHandle = 123;
        TextInput.State.currentlyFocusedInput.mockReturnValue(nodeHandle);
        const { result } = renderHook(() => useKeyboard(), {
            wrapper: ({ children }) => <KeyboardProvider>{children}</KeyboardProvider>,
        });

        act(() => {
            result.current.registerScrollViewRef('scrollView1', scrollViewRef);
        });

        const endCoordinates = { screenY: 600 };
        fireEvent(keyboardDidShowListener, { endCoordinates });

        expect(scrollViewRef.current.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard).toHaveBeenCalledWith(nodeHandle, 160, true);
    });
});
