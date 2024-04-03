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
            style={[sharedStyles.centeredViewContainer, { paddingTop: StatusBar.currentHeight }]}
            resizeMode="cover"
        >
            <StatusBar barStyle={theme === 'light-content'} />
            <View>
                <TouchableOpacity style={[sharedStyles.button, { height: 50, width: 250, marginBottom: '3%'}]} onPress={() => navigation.navigate('Login')}>
                    <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, {height: 50, width: 250, marginBottom: '3%'}]} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, {height: 50, width: 250, marginBottom: '3%'}]}>
                    <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>About Us</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
