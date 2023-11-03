import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import SharedStyles from '../../styles/SharedStyles';
import { AuthContext } from '../../components/authentication';


const LoginScreen = ({ navigation }) => {
    //const { setIsLoggedIn } = useContext(AuthContext);
    const { handleLogin } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                <TouchableOpacity style={SharedStyles.button} onPress={() => handleLogin(username, password)}>
                    <Text style={SharedStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default LoginScreen;
