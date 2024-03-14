import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { ThemeProvider } from './app/components/Theme';
import { connectToNotifications } from './app/components/Notifications';
import { BACKEND_URL } from '@env';
import * as Notifications from 'expo-notifications';


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
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;