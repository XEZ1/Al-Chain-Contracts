import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { ThemeProvider } from './app/components/Theme';
import { connectToNotifications } from './app/components/Notifications';
import { BACKEND_URL } from '@env';


const App = () => {
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