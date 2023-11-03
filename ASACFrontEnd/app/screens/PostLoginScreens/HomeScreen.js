import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { AuthContext, logout } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';

const HomeScreen = ({ navigation }) => {
    const { setIsLoggedIn } = useContext(AuthContext);

    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Main Screen!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => { logout(); setIsLoggedIn(false) }}
            >
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

// Other screens can be defined here
const ScreenTwo = () => (
    <View style={styles.container}>
        <Text>Screen Two</Text>
    </View>
);

const ScreenThree = () => (
    <View style={styles.container}>
        <Text>Screen Three</Text>
    </View>
);

const ScreenFour = () => (
    <View style={styles.container}>
        <Text>Screen Four</Text>
    </View>
);

export default HomeScreen;
