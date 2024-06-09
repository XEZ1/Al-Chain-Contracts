import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act, renderHook } from '@testing-library/react-hooks';
import { KeyboardProvider, useKeyboard, KeyboardContext } from '../../app/components/Keyboard';
import { LayoutAnimation, Keyboard, Dimensions, findNodeHandle, TextInput, Text } from 'react-native';


jest.mock('react-native/Libraries/Settings/Settings', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

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

function TestComponentAdditional() {
    const { registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    React.useEffect(() => {
        const ref = { current: 'testRef' };
        const id = 'testId';

        registerScrollViewRef(id, ref);

        return () => {
            unregisterScrollViewRef(id);
        };
    }, [registerScrollViewRef, unregisterScrollViewRef]);

    return <React.Fragment />;
}

const withMockKeyboardContext = (Component, values) => {
    return function Wrapper() {
      return (
        <KeyboardContext.Provider value={values}>
          <Component />
        </KeyboardContext.Provider>
      );
    };
  };

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

    it('should call register and unregister scrollViewRef on mount and un on mount', () => {
        const mockRegister = jest.fn();
        const mockUnregister = jest.fn();
    
        const values = {
          registerScrollViewRef: mockRegister,
          unregisterScrollViewRef: mockUnregister,
          keyboardHeight: 0,
          isKeyboardVisible: false,
        };
    
        const MockedComponent = withMockKeyboardContext(TestComponentAdditional, values);
    
        const { unmount } = render(
          <KeyboardProvider>
            <MockedComponent />
          </KeyboardProvider>
        );
    
        // Expect register to have been called
        expect(mockRegister).toHaveBeenCalledWith('testId', { current: 'testRef' });
    
        // Cleanup the component to trigger the useEffect cleanup function
        unmount();
    
        // Expect unregister to have been called
        expect(mockUnregister).toHaveBeenCalledWith('testId');
    });
});
