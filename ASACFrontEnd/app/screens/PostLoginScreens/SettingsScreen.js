import React, { useState, useContext } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { AuthContext, logout } from '../../components/Authentication';
import { ThemeContext } from '../../components/Theme';
import getStyles from '../../styles/SharedStyles';
import { getNotificationStatus,  deletePushToken, savePushToken } from '../../components/Notifications';
import * as Notifications from 'expo-notifications';

const SettingsScreen = ({ navigation }) => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);  
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleToggleTheme = () => {
        toggleTheme(); 
    };

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            // If notifications are currently off, register for notifications
            await savePushToken((await Notifications.getExpoPushTokenAsync()).data, isLoggedIn);
        } else {
            // If notifications are currently on, unregister notifications
            await deletePushToken(isLoggedIn);
        }
        setNotificationsEnabled(!notificationsEnabled);
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
        </View>
    );
};

export default SettingsScreen;
