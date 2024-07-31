import React, { useRef, useCallback, useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useKeyboard } from '../../components/Keyboard';
import { AuthContext } from '../../components/Authentication';
import { ThemeContext } from '../../components/Theme';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';


const SignUpScreen = ({ navigation }) => {
  
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    const { handleSignUp } = useContext(AuthContext);

    const scrollViewRef = useRef(null);
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    useFocusEffect(
        useCallback(() => {
            const id = "SignUpScreen";
            registerScrollViewRef(id, scrollViewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
    );

    return (
        <View style={[localStyles.backgroundContainer, { flex: 1, paddingBottom: keyboardHeight}]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <ScrollView ref={scrollViewRef} contentContainerStyle={sharedStyles.scrollViewContentContainer} style={[localStyles.bigTopMargin]} showsVerticalScrollIndicator={false}>
                <View style={[{ padding: '5%' }]}>
                    <View style={[sharedStyles.cardContainer, localStyles.mediumPadding, {width: '98%'}]}>
                        {Object.values(errors).some(error => error) && (
                            <TouchableOpacity
                                testID="error-icon-container"
                                style={sharedStyles.errorIconContainer}
                                onPress={() => setShowErrorDetails(true)}>
                                <MaterialCommunityIcons name="alert-circle" size={24} style={{ color: 'red' }} />
                            </TouchableOpacity>
                        )}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showErrorDetails}
                            onRequestClose={() => setShowErrorDetails(false)}
                            testID="error-modal"
                        >
                            <View style={sharedStyles.centeredViewContainer}>
                                <View style={sharedStyles.modalViewContainer}>
                                    <Text style={sharedStyles.modalText}>Please fix the following errors:</Text>
                                    {Object.entries(errors).map(([key, value]) =>
                                        <Text key={key} style={sharedStyles.errorListItem}>{`${key}: ${value}`}</Text>
                                    )}
                                    <TouchableOpacity
                                        style={[sharedStyles.button]}
                                        onPress={() => setShowErrorDetails(false)}
                                    >
                                        <Text style={[sharedStyles.generalText, localStyles.boldAlignedText]}>Got it</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={sharedStyles.exitButton} onPress={() => setShowErrorDetails(false)} testID="closeModalButton">
                                        <MaterialCommunityIcons name="close-circle" size={30} color='red'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <TextInput
                            placeholder="Username"
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            placeholder="First Name"
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            placeholder="Last Name"
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setLastName}
                        />
                        <TextInput
                            placeholder="Email"
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry
                            style={sharedStyles.inputField}
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            onChangeText={setPasswordConfirmation}
                        />
                        <TouchableOpacity style={sharedStyles.button} onPress={() =>
                            handleSignUp(username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors)
                        }>
                            <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight - 1}]} />
        </View>
    );
};

export default SignUpScreen;
