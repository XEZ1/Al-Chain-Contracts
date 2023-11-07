import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles'; 
import { ThemeContext } from '../../components/Theme';
import { BACKEND_URL } from '@env';

const SignUpScreen = ({ navigation }) => {
    const { handleLogin } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [errors, setErrors] = useState({});

    const handleSignUp = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/sign_up/`, {
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

            const data = await response.json();

            if (response.status === 400) {
                setErrors(data);
                Alert.alert('Error', 'Please fix the errors');
            } else if (response.status === 201) {
                Alert.alert('Success', 'Account created successfully');
                handleLogin(username, password)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {errors && Object.keys(errors).map((key, index) => (
                <Text key={index} style={{ color: 'red' }}>{`${key}: ${errors[key]}`}</Text>
            ))}

            <TextInput
                placeholder="Username"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="First Name"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setFirstName}
            />
            <TextInput
                placeholder="Last Name"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setLastName}
            />
            <TextInput
                placeholder="Email"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setPasswordConfirmation}
            />
            <TouchableOpacity style={styles.buttonPreLogin} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;
