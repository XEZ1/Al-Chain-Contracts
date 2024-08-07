import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PreLoginScreen from '../screens/PreLoginScreens/PreLoginScreen';
import LoginScreen from '../screens/PreLoginScreens/LoginScreen';
import SignUpScreen from '../screens/PreLoginScreens/SignUpScreen';
import AboutUsScreen from '../screens/PreLoginScreens/AboutUsScreen';


// Create stack navigator for pre-login screens
const Stack = createStackNavigator();

/**
 * PreLoginStack component to manage the stack navigation for the pre-login screens.
 * This component contains the PreLogin, Login, and SignUp screens.
 * @returns {ReactElement} - The PreLoginStack component
 * @exports PreLoginStack
 */
const PreLoginStack = () => {
    return (
        <Stack.Navigator initialRouteName="PreLogin" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PreLogin" component={PreLoginScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
            <Stack.Screen name="AboutUs" component={AboutUsScreen}/>
        </Stack.Navigator>
    );
};

export default PreLoginStack;
