import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SharedStyles from '../styles/SharedStyles';
import { BACKEND_URL } from '@env' 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('handleLogin called'); // Debugging line to confirm the function is called
  
    try {
      console.log('Trying to fetch:', `${BACKEND_URL}/login/`); // Output the URL you're trying to hit
  
      const response = await fetch(`${BACKEND_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      console.log('Fetch called'); // This will log if fetch is called
      const data = await response.json();
      console.log('Response:', data); // Output the received data
  
      if (response.ok) {
        // Successfully logged in
      } else {
        Alert.alert('Login Failed', data.message || 'An error occurred');
      }
    } catch (error) {
      console.log('Error:', error); // This will output any caught errors
      Alert.alert('Login Failed', 'An error occurred');
    }
  };
  
  
  return (
    <ImageBackground
      //source={require('../../assets/PreLoginScreenBackground.png')}
      style={SharedStyles.backgroundImage}
      resizeMode="cover"
    >
      <View style={SharedStyles.container}>
        <TextInput
          placeholder="Username"
          style={SharedStyles.input}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={SharedStyles.input}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={SharedStyles.button} onPress={handleLogin}>
          <Text style={SharedStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
