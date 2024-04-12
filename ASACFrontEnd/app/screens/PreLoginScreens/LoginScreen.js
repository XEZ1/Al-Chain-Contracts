import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import { ThemeContext } from '../../components/Theme';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';


const LoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    const { handleLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView style={sharedStyles.container} behavior="padding">
            <View style={[sharedStyles.cardContainer]}>
                <TextInput
                    placeholder="Username"
                    style={sharedStyles.inputField}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={sharedStyles.inputField}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={sharedStyles.button} onPress={() => handleLogin(username, password)}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
