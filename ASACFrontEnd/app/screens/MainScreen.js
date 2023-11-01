import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SharedStyles from '../styles/SharedStyles';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const MainScreen = ({ navigation }) => {
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/validate_token/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok || !data.token_valid) {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.log('Error:', error);
        navigation.navigate('Login');
      }
    };

    validateToken();
  }, [navigation]);

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Welcome to the Main Screen!</Text>
      <TouchableOpacity
        style={SharedStyles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={SharedStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;
