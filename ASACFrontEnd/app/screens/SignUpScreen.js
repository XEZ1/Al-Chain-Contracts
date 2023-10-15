import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BACKEND_URL } from '@env';

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSignUp = async () => {
        const response = await fetch(`${BACKEND_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert('Success', 'You have successfully signed up.');
            // Navigate to login or another part of your app
        } else {
            Alert.alert('Error', data.message || 'An error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
            />
            <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                style={styles.input}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
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
        width: '80%',
        height: 44,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(220, 220, 220, 0.8)',
    },
    button: {
        height: 44,
        width: '80%', // Use 80% width to align with the TextInput fields
        backgroundColor: 'rgba(1, 193, 219, 0.8)', // Semi-transparent background color
        marginBottom: 16,
        borderRadius: 10, // Rounded corners
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'rgb(57, 63, 67)',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
