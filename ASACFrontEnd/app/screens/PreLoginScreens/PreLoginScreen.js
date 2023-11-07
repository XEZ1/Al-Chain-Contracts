import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';

const PreLoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <ImageBackground
            source={require('../../../assets/PreLoginScreenBackground.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.containerWithoutBackground}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonPreLogin} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonTextPreLogin}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonPreLogin} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.buttonTextPreLogin}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonPreLogin}>
                        <Text style={styles.buttonTextPreLogin}>About Us</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
