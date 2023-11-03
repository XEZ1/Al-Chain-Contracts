import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PreLoginScreen from '../screens/PreLoginScreens/PreLoginScreen';
import LoginScreen from '../screens/PreLoginScreens/LoginScreen';
import SignUpScreen from '../screens/PreLoginScreens/SignUpScreen';

const Stack = createStackNavigator();

const PreLoginStack = () => {
    return (
        <Stack.Navigator initialRouteName="PreLogin" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PreLogin" component={PreLoginScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
};

export default PreLoginStack;
