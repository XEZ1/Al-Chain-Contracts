import React, { useEffect } from 'react';
import { UIManager, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import ErrorBoundary from './ErrorBoundary'
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { KeyboardProvider } from './app/components/Keyboard';
import { ThemeProvider } from './app/components/Theme';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

if (__DEV__) {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.log(error, isFatal);
      console.log(error.stack);
    });
  }
  

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, 
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const App = () => {
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        return () => Notifications.removeNotificationSubscription(subscription);
    }, []);

    return (
        <AuthProvider>
            <ThemeProvider>
                <KeyboardProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </KeyboardProvider>
            </ThemeProvider>
        </AuthProvider>
    
    );
};

export default App;