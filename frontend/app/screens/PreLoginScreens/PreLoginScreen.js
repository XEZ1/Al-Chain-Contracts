import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { ThemeContext } from '../../components/Theme';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';


/**
 * PreLoginScreen component renders the initial screen with options to navigate to Login, Sign Up, or About Us.
 *
 * @param {object} navigation - React Navigation object for navigating between screens.
 * @returns {JSX.Element} - Rendered component for the pre-login screen.
 */
const PreLoginScreen = ({ navigation }) => {
    // Access the current theme from the ThemeContext
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    return (
        <ImageBackground
            source={require('../../../assets/PreLoginScreenBackground.jpg')}
            style={[sharedStyles.centeredViewContainer, { paddingTop: StatusBar.currentHeight }]}
            resizeMode="cover"
        >
            <StatusBar barStyle={'light-content'} />
            <View>
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]} onPress={() => navigation.navigate('Login')}>
                    <Text style={[sharedStyles.boldMediumText, { color: 'rgb(57, 63, 67)' }]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[sharedStyles.boldMediumText, { color: 'rgb(57, 63, 67)' }]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[sharedStyles.button, localStyles.localButtonContainer]} onPress={() => navigation.navigate('AboutUs')}>
                    <Text style={[sharedStyles.boldMediumText, { color: 'rgb(57, 63, 67)' }]}>About Us</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default PreLoginScreen;
