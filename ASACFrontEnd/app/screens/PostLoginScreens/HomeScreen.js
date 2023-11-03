import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import SharedStyles from '../../styles/SharedStyles';
import { AuthContext, logout } from '../../components/authentication';

const HomeScreen = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);

    return (
        <View style={SharedStyles.container}>
            <Text style={SharedStyles.title}>Welcome to the Main Screen!</Text>
            <TouchableOpacity
                style={SharedStyles.button}
                onPress={() => { logout(); setIsLoggedIn(false) }}
            >
                <Text style={SharedStyles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

// Other screens can be defined here
const ScreenTwo = () => (
    <View style={SharedStyles.container}>
        <Text>Screen Two</Text>
    </View>
);

const ScreenThree = () => (
    <View style={SharedStyles.container}>
        <Text>Screen Three</Text>
    </View>
);

const ScreenFour = () => (
    <View style={SharedStyles.container}>
        <Text>Screen Four</Text>
    </View>
);

export default HomeScreen;
