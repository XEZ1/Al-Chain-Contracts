import React, { useRef, useCallback, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import { ThemeContext } from '../../components/Theme';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../components/Keyboard';
import { ScrollView } from 'react-native-gesture-handler';


const LoginScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    const { handleLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const scrollViewRef = useRef(null);
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();
    const postCommentRef = useRef(null);

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
            <ScrollView ref={scrollViewRef} style={sharedStyles.avoidingTabBarContainer} showsVerticalScrollIndicator={false}>
                <View style={[localStyles.container, { flex: 1 }]}>
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
                </View>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;