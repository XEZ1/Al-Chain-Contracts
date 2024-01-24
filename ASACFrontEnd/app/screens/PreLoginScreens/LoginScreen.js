import React, { useState, useContext } from 'react';
import { Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';


const LoginScreen = ({ navigation }) => {
    const { handleLogin } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior="padding"
        >
            <TextInput
                placeholder="Username"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.buttonPreLogin} onPress={() => handleLogin(username, password)}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
