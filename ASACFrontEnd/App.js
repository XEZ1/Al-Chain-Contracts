import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PreLoginScreen from './app/screens/PreLoginScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PreLogin">
        <Stack.Screen name="PreLogin" component={PreLoginScreen} options={{
            headerShown: false, // Hide the header bar
          }}/>
        {/* Add more screens/routes as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;