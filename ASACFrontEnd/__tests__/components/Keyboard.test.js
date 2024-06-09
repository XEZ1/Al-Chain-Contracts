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

function TestComponent() {
    const { isKeyboardVisible } = useKeyboard();
    return <Text>{isKeyboardVisible ? 'Visible' : 'Hidden'}</Text>;
}

function TestRefComponent() {
    const { registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    React.useEffect(() => {
        const id = 'testId';
        const ref = { current: new Object() };  // Simulating a React ref

        // Register the ref
        registerScrollViewRef(id, ref);

        return () => {
            // Unregister the ref on cleanup
            unregisterScrollViewRef(id);
        };
    }, [registerScrollViewRef, unregisterScrollViewRef]);

    return <Text>Ref Test Component</Text>;
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

});
