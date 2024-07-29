import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { LayoutAnimation, Keyboard, Dimensions, findNodeHandle, TextInput, Platform  } from 'react-native';


export const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const scrollViewRefs = useRef(new Map());

    useEffect(() => {
        const handleKeyboardDidShow = (e) => {
            setIsKeyboardVisible(true);
            const screenHeight = Dimensions.get('window').height;
            const endY = e.endCoordinates.screenY;
            LayoutAnimation.easeInEaseOut();

            if (Platform.OS === 'ios') {
                setKeyboardHeight(screenHeight - endY - 90);
            } else {
                setKeyboardHeight(screenHeight - endY - 255);
            }

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

        const handleKeyboardDidHide = () => {
            LayoutAnimation.easeInEaseOut(); 
            setIsKeyboardVisible(false);
            setKeyboardHeight(0);
        };

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const registerScrollViewRef = (id, ref) => {
        scrollViewRefs.current.set(id, ref);
    };

    const unregisterScrollViewRef = (id) => {
        scrollViewRefs.current.delete(id);
    };

    return (
        <KeyboardContext.Provider value={{ keyboardHeight, isKeyboardVisible, registerScrollViewRef, unregisterScrollViewRef }}>
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboard = () => useContext(KeyboardContext);
