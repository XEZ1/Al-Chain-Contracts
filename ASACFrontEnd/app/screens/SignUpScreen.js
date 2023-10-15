import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SharedStyles from '../styles/SharedStyles';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();

  const handleSignUp = async () => {
    // Your logic to handle sign up using your backend goes here.
    // For demonstration purposes, you can use the following lines.
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/sign_up/`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          new_password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully signed up
        // Navigate or do something
      } else {
        Alert.alert('Sign Up Failed', data.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Sign Up Failed', 'An error occurred');
    }
  };

  return (
    <View style={SharedStyles.container}>
      <TextInput
        placeholder="Username"
        style={SharedStyles.input}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="First Name"
        style={SharedStyles.input}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        style={SharedStyles.input}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        style={SharedStyles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={SharedStyles.input}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={SharedStyles.input}
        onChangeText={setPasswordConfirmation}
      />
      <TouchableOpacity style={SharedStyles.button} onPress={handleSignUp}>
        <Text style={SharedStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
