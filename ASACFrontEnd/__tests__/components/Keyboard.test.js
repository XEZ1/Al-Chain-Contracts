import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act, renderHook } from '@testing-library/react-hooks';
import { KeyboardProvider, useKeyboard, KeyboardContext } from '../../app/components/Keyboard';
import { LayoutAnimation, Keyboard, Dimensions, findNodeHandle, TextInput, Text } from 'react-native';


jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => {
    const originalModule = jest.requireActual('react-native/Libraries/Components/Keyboard/Keyboard');
    return {
        ...originalModule,
        addListener: jest.fn((eventType, listener) => ({
            remove: jest.fn()
        })),
        removeListener: jest.fn(),
    };
});

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
    const originalModule = jest.requireActual('react-native/Libraries/Utilities/Dimensions');
    return {
        ...originalModule,
        get: jest.fn((dim) => {
            return {
                width: 800,
                height: 600,
                scale: 2,
                fontScale: 1
            };
        }),
    };
});

jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => {
    const actualTextInput = jest.requireActual('react-native/Libraries/Components/TextInput/TextInput');
    return {
        ...actualTextInput,
        State: {
            ...actualTextInput.State,
            currentlyFocusedInput: jest.fn()
        }
    };
});

function TestComponent() {
    const { isKeyboardVisible } = useKeyboard();
    return <Text>{isKeyboardVisible ? 'Visible' : 'Hidden'}</Text>;
}

function TestRefComponent() {
    const { registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    React.useEffect(() => {
        const id = 'testId';
        const ref = { current: new Object() };

        registerScrollViewRef(id, ref);

        return () => {
            unregisterScrollViewRef(id);
        };
    }, [registerScrollViewRef, unregisterScrollViewRef]);

    return <Text>Ref Test Component</Text>;
}

function TestComponentWithTextInput() {
    const { registerScrollViewRef } = useKeyboard();
    const inputRef = React.createRef();

    inputRef.current = {
        getScrollResponder: () => ({
            scrollResponderScrollNativeHandleToKeyboard: jest.fn()
        })
    };

    React.useEffect(() => {
        registerScrollViewRef('textInput', inputRef);
        TextInput.State.currentlyFocusedInput.mockReturnValue(inputRef.current);
    }, [registerScrollViewRef]);

    return <TextInput ref={inputRef} />;
}

describe('KeyboardProvider', () => {

    it('updates keyboard visibility on keyboardDidShow and keyboardDidHide', async () => {
        let showCallback;
        let hideCallback;

        Keyboard.addListener.mockImplementation((event, callback) => {
            if (event === 'keyboardDidShow') {
                showCallback = callback;
            } else if (event === 'keyboardDidHide') {
                hideCallback = callback;
            }
            return { remove: jest.fn() };
        });

        const { getByText } = render(
            <KeyboardProvider>
                <TestComponent />
            </KeyboardProvider>
        );

        act(() => showCallback({ endCoordinates: { screenY: 500 } }));
        expect(getByText('Visible')).toBeTruthy();

        act(() => hideCallback());
        expect(getByText('Hidden')).toBeTruthy();
    });

    it('registers and unregisters scrollViewRef on mount and unmount', () => {
        const { unmount, getByText } = render(
            <KeyboardProvider>
                <TestRefComponent />
            </KeyboardProvider>
        );

        expect(getByText('Ref Test Component')).toBeTruthy();

        unmount();
    });

    it('should handle keyboard did show when text input is focused', async () => {
        // Mock the currentlyFocusedInput to return a ref simulating a focused TextInput
        TextInput.State.currentlyFocusedInput.mockReturnValue({ _nativeTag: 1 });
        const nodeHandleMock = jest.spyOn(require('react-native'), 'findNodeHandle').mockReturnValue(1);
        
        jest.spyOn(React, 'createRef').mockReturnValue(() => ({
            current: {
                getScrollResponder: () => ({
                    scrollResponderScrollNativeHandleToKeyboard: jest.fn()
                })
            }
        }));

        let showCallback;
        Keyboard.addListener.mockImplementation((event, callback) => {
            if (event === 'keyboardDidShow') {
                showCallback = callback;
            }
            return { remove: jest.fn() };
        });

        const { unmount } = render(
            <KeyboardProvider>
                <TestComponentWithTextInput />
            </KeyboardProvider>
        );

        await act(async () => {
            showCallback({ endCoordinates: { screenY: 500 } });
        });

        expect(nodeHandleMock).toHaveBeenCalled();

        unmount();
        nodeHandleMock.mockRestore();
    });
});
