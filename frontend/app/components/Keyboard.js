import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { LayoutAnimation, Keyboard, Dimensions, findNodeHandle, TextInput, Platform  } from 'react-native';


// Create a context to manage keyboard state and related methods
export const KeyboardContext = createContext();

/**
 * KeyboardProvider component to provide keyboard context to the application.
 * This component handles keyboard visibility and height changes.
 * It also manages scrolling behaviour when the keyboard is visible.
 * @param {object} children - The child components to render within the provider.
 */
export const KeyboardProvider = ({ children }) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const scrollViewRefs = useRef(new Map());

    useEffect(() => {
        /**
         * Handle the event when the keyboard is shown.
         * @param {object} e - The event object containing keyboard dimensions.
         */
        const handleKeyboardDidShow = (e) => {
            setIsKeyboardVisible(true);
            const screenHeight = Dimensions.get('window').height;
            const endY = e.endCoordinates.screenY;
            LayoutAnimation.easeInEaseOut();

            // Set keyboard height based on platform
            if (Platform.OS === 'ios') {
                setKeyboardHeight(screenHeight - endY - 90);
            } else {
                setKeyboardHeight(screenHeight - endY - 255);
            }

            // Adjust the scroll view to ensure the currently focused input is visible
            const currentlyFocusedField = TextInput.State.currentlyFocusedInput();
            if (currentlyFocusedField) {
                const nodeHandle = findNodeHandle(currentlyFocusedField);
                scrollViewRefs.current.forEach((scrollViewRef) => {
                    scrollViewRef.current?.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
                        nodeHandle,
                        160,
                        true
                    );
                });
            }
        };

        /**
         * Handle the event when the keyboard is hidden.
         */
        const handleKeyboardDidHide = () => {
            LayoutAnimation.easeInEaseOut(); 
            setIsKeyboardVisible(false);
            setKeyboardHeight(0);
        };

        // Add event listeners for keyboard show and hide events
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        // Clean up event listeners when the component is unmounted
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    /**
     * Register a scroll view reference to manage its scroll behaviour.
     * @param {string} id - The unique identifier for the scroll view.
     * @param {object} ref - The reference to the scroll view.
     */
    const registerScrollViewRef = (id, ref) => {
        scrollViewRefs.current.set(id, ref);
    };

    /**
     * Unregister a scroll view reference.
     * @param {string} id - The unique identifier for the scroll view.
     */
    const unregisterScrollViewRef = (id) => {
        scrollViewRefs.current.delete(id);
    };

    return (
        <KeyboardContext.Provider value={{ keyboardHeight, isKeyboardVisible, registerScrollViewRef, unregisterScrollViewRef }}>
            {children}
        </KeyboardContext.Provider>
    );
};

/**
 * Custom hook to use the keyboard context.
 * @returns {object} - The keyboard context value.
 */
export const useKeyboard = () => useContext(KeyboardContext);
