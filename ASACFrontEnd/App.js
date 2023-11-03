import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/components/authentication';
import AppNavigator from './app/navigation/AppNavigator';


const App = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;