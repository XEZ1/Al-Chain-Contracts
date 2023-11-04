import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { ThemeProvider } from './app/components/Theme';
import { useNotification } from './app/components/Notifications';


const NotificationWrapper = () => {
    useNotification();
    return null; // Render nothing, or some notification UI if you have
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <NotificationWrapper />
                    <AppNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;