import React, { useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getLocalStyles from './LocalSharedStyles';


const SignUpScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    const { handleSignUp } = useContext(AuthContext);

    return (
        <KeyboardAvoidingView
            style={[sharedStyles.container, { paddingTop: '16%' }]}
            behavior="padding"
        >
            <View style={[sharedStyles.card, { justifyContent: 'center', alignItems: 'center' }]}>
                {Object.values(errors).some(error => error) && (
                    <TouchableOpacity
                        style={localStyles.errorIconContainerSignUp}
                        onPress={() => setShowErrorDetails(true)}>
                        <MaterialCommunityIcons name="alert-circle" size={24} style={sharedStyles.errorIcon} />
                    </TouchableOpacity>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showErrorDetails}
                    onRequestClose={() => setShowErrorDetails(false)}
                >
                    <View style={sharedStyles.centeredView}>
                        <View style={sharedStyles.modalView}>
                            <Text style={sharedStyles.modalText}>Please fix the following errors:</Text>
                            {Object.entries(errors).map(([key, value]) =>
                                value ? <Text key={key} style={sharedStyles.errorListItem}>{`${key}: ${value}`}</Text> : null
                            )}
                            <TouchableOpacity
                                style={[sharedStyles.button]}
                                onPress={() => setShowErrorDetails(false)}
                            >
                                <Text style={sharedStyles.textStyle}>Got it</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={sharedStyles.exitButton}
                                onPress={() => setShowErrorDetails(false)}
                            >
                                <MaterialCommunityIcons
                                    name="close-circle"
                                    size={30}
                                    color='red'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <TextInput
                    placeholder="Username"
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="First Name"
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setFirstName}
                />
                <TextInput
                    placeholder="Last Name"
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setLastName}
                />
                <TextInput
                    placeholder="Email"
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setPassword}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    style={localStyles.inputPreLogin}
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    onChangeText={setPasswordConfirmation}
                />
                <TouchableOpacity style={localStyles.buttonPreLogin} onPress={() =>
                    handleSignUp(username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors)
                }>
                    <Text style={localStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;
