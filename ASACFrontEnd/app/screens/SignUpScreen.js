import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SharedStyles from '../styles/SharedStyles';
import { BACKEND_URL } from '@env';
import { api_url, login } from "../../authentication";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [errors, setErrors] = useState({});

  const handleSignUp = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/sign_up/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        setErrors(data);
        Alert.alert('Error', 'Please fix the errors');
      } else if (res.status === 201) {
        Alert.alert('Success', 'Account created successfully');
        // Your additional logic here
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={SharedStyles.container}>
      {errors && Object.keys(errors).map((key, index) => (
        <Text key={index} style={{color: 'red'}}>{`${key}: ${errors[key]}`}</Text>
      ))}
      
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
