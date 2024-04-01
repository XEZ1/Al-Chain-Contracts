import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import { StatusBar } from 'react-native';
import getLocalStyles from './LocalSharedStyles';

const PreLoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);

    return (
        <ImageBackground
            source={require('../../../assets/PreLoginScreenBackground.png')}
            style={[localStyles.backgroundImage, { paddingTop: StatusBar.currentHeight }]}
            resizeMode="cover"
        >
            <StatusBar barStyle={theme === 'light-content'} />
            <View style={localStyles.containerWithoutBackground}>
                <TouchableOpacity style={[localStyles.buttonPreLogin, {width: 250, marginBottom: '3%'}]} onPress={() => navigation.navigate('Login')}>
                    <Text style={localStyles.buttonTextPreLogin}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[localStyles.buttonPreLogin, {width: 250, marginBottom: '3%'}]} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={localStyles.buttonTextPreLogin}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[localStyles.buttonPreLogin, {width: 250, marginBottom: '3%'}]}>
                    <Text style={localStyles.buttonTextPreLogin}>About Us</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
