import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PreLoginScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../assets/PreLoginScreenBackground.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('SignUp')}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>About Us</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 250, // Increase the width for better button spacing
    },
    button: {
        height: 44,
        width: '100%', // Use 100% width to make buttons fill the container
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

export default PreLoginScreen;
