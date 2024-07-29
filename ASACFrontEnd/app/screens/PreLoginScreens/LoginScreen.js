import React, { useRef, useCallback, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../components/Authentication';
import { useKeyboard } from '../../components/Keyboard';
import { ThemeContext } from '../../components/Theme';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';


const LoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    const { handleLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const scrollViewRef = useRef(null);
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    useFocusEffect(
        useCallback(() => {
            const id = "LoginScreen";
            registerScrollViewRef(id, scrollViewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
    );

    return (
        <View style={[localStyles.backgroundContainer, { flex: 1, paddingBottom: keyboardHeight }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <ScrollView ref={scrollViewRef} style={[sharedStyles.avoidingTabBarContainer, ]} showsVerticalScrollIndicator={false}> 
                <View style={[localStyles.container, { flex: 1 }]}> 
                    <View style={[sharedStyles.cardContainer, localStyles.fullWidth, localStyles.zeroMargin]}>
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
                </View>
            </ScrollView>
            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight - 1}]} />
        </View>
    );
};

export default LoginScreen;
