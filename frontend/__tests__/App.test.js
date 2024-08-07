import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
import { Platform, UIManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../app/navigation/AppNavigator';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


jest.mock('react-native', () => {
    const actualReactNative = jest.requireActual('react-native');
    actualReactNative.UIManager.setLayoutAnimationEnabledExperimental = jest.fn();
    return actualReactNative;
});

jest.mock('react-native/Libraries/Settings/Settings', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => <div>{children}</div>
}));

jest.mock('expo-notifications', () => {
    const originalNotifications = jest.requireActual('expo-notifications');
    return {
        ...originalNotifications,
        setNotificationHandler: jest.fn(() => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        })),
        addNotificationReceivedListener: jest.fn(),
        removeNotificationSubscription: jest.fn(),
    };
});

jest.mock('../app/navigation/AppNavigator', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>AppNavigator</Text>;
});

jest.mock('../ErrorBoundary', () => 'ErrorBoundary');

jest.mock('../app/components/Authentication', () => ({ AuthProvider: ({ children }) => <div>{children}</div> }));

jest.mock('../app/components/Keyboard', () => ({ KeyboardProvider: ({ children }) => <div>{children}</div> }));

jest.mock('../app/components/Theme', () => ({ ThemeProvider: ({ children }) => <div>{children}</div> }));

global.ErrorUtils = {
    setGlobalHandler: jest.fn(),
    getGlobalHandler: jest.fn()
};

describe('App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('enables layout animation on Android', () => {
        jest.isolateModules(() => {
            Platform.OS = 'android';
            require('../App');
            expect(UIManager.setLayoutAnimationEnabledExperimental).toHaveBeenCalledWith(true);
        });
    });

    it('sets global error handler in development mode', () => {
        jest.isolateModules(() => {
            global.__DEV__ = true; 
            require('../App');
            expect(global.ErrorUtils.setGlobalHandler).toHaveBeenCalled();
            global.__DEV__ = false;
        });
    });

    it('logs errors globally', () => {
        jest.isolateModules(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            global.__DEV__ = true;
            require('../App');

            const mockError = new Error('Test error');
            const errorHandler = global.ErrorUtils.setGlobalHandler.mock.calls[0][0];
            errorHandler(mockError, false);

            expect(consoleLogSpy).toHaveBeenCalledWith(mockError, false);
            expect(consoleLogSpy).toHaveBeenCalledWith(mockError.stack);

            global.__DEV__ = false;
            consoleLogSpy.mockRestore();
        });
    });

    it('configures notification handler', () => {
        jest.isolateModules(() => {
            require('../App');
            const { setNotificationHandler } = require('expo-notifications');
            expect(setNotificationHandler).toHaveBeenCalled();
        });
    });

    it('handles notifications', () => {
        const listenerSpy = jest.spyOn(Notifications, 'addNotificationReceivedListener');
        render(<App />);
        expect(listenerSpy).toHaveBeenCalled();
    });

    it('processes notifications correctly', async () => {
        jest.isolateModules(async () => {
            require('../App');
            const handler = Notifications.setNotificationHandler.mock.calls[0][0];
            const result = await handler.handleNotification();
            expect(result).toEqual({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true });
        });
    });

    it('logs received notifications correctly', () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(<App />);
        expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();

        const listenerCallback = Notifications.addNotificationReceivedListener.mock.calls[0][0];
        const mockNotification = { id: 'test', data: 'data' };
        listenerCallback(mockNotification); 
        expect(consoleLogSpy).toHaveBeenCalledWith(mockNotification);

        consoleLogSpy.mockRestore();
    });

    it('cleans up notification listener on unmount', () => {
        const removeSpy = jest.spyOn(Notifications, 'removeNotificationSubscription');
        const { unmount } = render(<App />);
        unmount();
        expect(removeSpy).toHaveBeenCalled();
    });

    it('renders correctly', () => {
        const { getByText } = render(<App />);
        expect(getByText('AppNavigator')).toBeTruthy();
    });
});

