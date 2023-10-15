import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/screens/LoginScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown: false, // Hide the header bar
          }}/>
        {/* Add more screens/routes as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;