import React, { useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const SignUpScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

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
            style={[styles.container, { paddingTop: '16%' }]}
            behavior="padding"
        >
            {Object.values(errors).some(error => error) && (
                <TouchableOpacity
                    style={styles.errorIconContainerSignUp}
                    onPress={() => setShowErrorDetails(true)}>
                    <MaterialCommunityIcons name="alert-circle" size={24} style={styles.errorIcon} />
                </TouchableOpacity>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showErrorDetails}
                onRequestClose={() => setShowErrorDetails(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Please fix the following errors:</Text>
                        {Object.entries(errors).map(([key, value]) =>
                            value ? <Text key={key} style={styles.errorListItem}>{`${key}: ${value}`}</Text> : null
                        )}
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={() => setShowErrorDetails(false)}
                        >
                            <Text style={styles.textStyle}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TextInput
                placeholder="Username"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="First Name"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setFirstName}
            />
            <TextInput
                placeholder="Last Name"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setLastName}
            />
            <TextInput
                placeholder="Email"
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setPassword}
            />
            <TextInput
                placeholder="Confirm Password"
                secureTextEntry
                style={styles.inputPreLogin}
                placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                onChangeText={setPasswordConfirmation}
            />
            <TouchableOpacity style={styles.buttonPreLogin} onPress={() =>
                handleSignUp(username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors)
            }>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;
