import React, { useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import { ThemeContext } from '../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';


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

    return (
        <View style={[sharedStyles.container, { paddingTop: '16%' }]}>
            <View style={[sharedStyles.cardContainer, localStyles.mediumPadding]}>
                {Object.values(errors).some(error => error) && (
                    <TouchableOpacity
                        style={sharedStyles.errorIconContainer}
                        onPress={() => setShowErrorDetails(true)}>
                        <MaterialCommunityIcons name="alert-circle" size={24} style={{color: 'red'}} />
                    </TouchableOpacity>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showErrorDetails}
                    onRequestClose={() => setShowErrorDetails(false)}
                >
                    <View style={sharedStyles.centeredViewContainer}>
                        <View style={sharedStyles.modalViewContainer}>
                            <Text style={sharedStyles.modalText}>Please fix the following errors:</Text>
                            {Object.entries(errors).map(([key, value]) =>
                                value ? <Text key={key} style={sharedStyles.errorListItem}>{`${key}: ${value}`}</Text> : null
                            )}
                            <TouchableOpacity
                                style={[sharedStyles.button]}
                                onPress={() => setShowErrorDetails(false)}
                            >
                                <Text style={[sharedStyles.generalText, localStyles.boldAlignedText]}>Got it</Text>
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
    );
};

export default SignUpScreen;
