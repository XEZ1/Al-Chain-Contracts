import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SharedStyles from '../styles/SharedStyles';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Your logic to handle login using your backend goes here.
    // For demonstration purposes, you can use the following lines.
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully logged in
        // Navigate or do something
      } else {
        Alert.alert('Login Failed', data.message || 'An error occurred');
      }
    } catch (error) {
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
