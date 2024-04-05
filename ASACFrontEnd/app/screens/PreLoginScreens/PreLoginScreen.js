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
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]} onPress={() => navigation.navigate('Login')}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>About Us</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
