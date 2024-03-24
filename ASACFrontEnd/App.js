import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { ThemeProvider } from './app/components/Theme';
import { connectToNotifications } from './app/components/Notifications';
import { BACKEND_URL } from '@env';
import * as Notifications from 'expo-notifications';
import ErrorBoundary from './ErrorBoundary'

if (__DEV__) {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.log(error, isFatal);
      console.log(error.stack);
    });
  }
  

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, // This will show the notification as an alert when the app is in the foreground.
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
        <ErrorBoundary>
        <AuthProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;