import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import SharedStyles from '../styles/SharedStyles';

const PreLoginScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../assets/PreLoginScreenBackground.png')}
            style={SharedStyles.backgroundImage}
            resizeMode="cover"
        >
            <View style={SharedStyles.container}>
                <View style={SharedStyles.buttonContainer}>
                    <TouchableOpacity style={SharedStyles.button} onPress={ () => navigation.navigate('Login')}>
                        <Text style={SharedStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={SharedStyles.button} onPress={ () => navigation.navigate('SignUp')}>
                        <Text style={SharedStyles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={SharedStyles.button}>
                        <Text style={SharedStyles.buttonText}>About Us</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
