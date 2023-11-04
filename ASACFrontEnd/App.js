import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/Authentication';
import AppNavigator from './app/navigation/AppNavigator';
import { ThemeProvider } from './app/components/Theme';
import { useNotification } from './app/components/Notifications';


const App = () => {
    useNotification();
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