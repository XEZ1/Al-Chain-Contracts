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
            <Text style={sharedStyles.title}>Settings</Text>

            <View style={sharedStyles.settingItem}>
                <Text style={sharedStyles.settingText}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme.isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>

            <View style={sharedStyles.settingItem}>
                <Text style={sharedStyles.settingText}>Notifications</Text>
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
                <Text style={sharedStyles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    );
};

export default SettingsScreen;
