import React, { useContext } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { AuthContext, logout } from '../../../components/Authentication';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';
import { useSettingsScreen } from './UseSettingsScreen';
import getLocalStyles from './LocalSharedStyles';

const SettingsScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { notificationsEnabled, setNotificationsEnabled, toggleNotifications } = useSettingsScreen();


    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.pageHeaderText}>Settings</Text>

            <View style={[sharedStyles.rowCenteredContainer, { width: '100%', marginBottom: '3%' }]}>
                <Text style={[sharedStyles.generalText, { fontSize: 18 }]}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme === 'dark' ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>

            <View style={[sharedStyles.rowCenteredContainer, { width: '100%', marginBottom: '3%' }]}>
                <Text style={[sharedStyles.generalText, { fontSize: 18 }]}>Notifications</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleNotifications}
                    value={notificationsEnabled}
                />
            </View>

            <TouchableOpacity
                style={sharedStyles.button}
                onPress={() => { logout(); setIsLoggedIn(false) }}
            >
                <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Log Out</Text>
            </TouchableOpacity>

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    );
};

export default SettingsScreen;
