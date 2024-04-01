import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import getLocalStyles from './LocalSharedStyles';


const LoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);

    const { handleLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={sharedStyles.container}
            behavior="padding"
        >
            <View style={[sharedStyles.card, { justifyContent: 'center', alignItems: 'center' }]}>
                <TextInput
                    placeholder="Username"
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={localStyles.buttonPreLogin} onPress={() => handleLogin(username, password)}>
                    <Text style={localStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
