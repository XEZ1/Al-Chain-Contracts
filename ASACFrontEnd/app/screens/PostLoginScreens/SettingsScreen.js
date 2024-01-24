import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { AuthContext, logout } from '../../components/Authentication';
import { ThemeContext } from '../../components/Theme';
import getStyles from '../../styles/SharedStyles';
import { deletePushToken, savePushToken } from '../../components/Notifications';
import * as Notifications from 'expo-notifications';

const SettingsScreen = ({ navigation }) => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);  
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleToggleTheme = () => {
        toggleTheme(); 
    };

    const toggleNotifications = async () => {
        const newStatus = !notificationsEnabled;
        setNotificationsEnabled(newStatus);

        if (newStatus) {
            // Enable notifications
            const token = await Notifications.getExpoPushTokenAsync();
            savePushToken(token);  // Save the token to your backend or service
        } else {
            // Disable notifications
            deletePushToken();  // Remove the token from your backend or service
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme.isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleToggleTheme}
                    value={isDarkMode}
                />
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleNotifications}
                    value={notificationsEnabled}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => { logout(); setIsLoggedIn(false) }}
            >
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </View>
    );
};

export default SettingsScreen;
