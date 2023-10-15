import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BACKEND_URL } from '@env';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
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

      const result = await response.json();

      if (response.ok) {
        // Navigate to home screen or dashboard
        Alert.alert('Success', 'Success')
        // navigation.navigate('Home'); // Assume you have a Home screen in your stack navigator
      } else {
        Alert.alert('Error', result.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not perform the operation.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    width: 300,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#01C1DB',
    padding: 12,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#393F43',
    fontSize: 16,
  },
});

export default LoginScreen;
