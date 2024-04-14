import React, { useContext } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { AuthContext, logout } from '../../../components/Authentication';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import { useSettingsScreen } from './UseSettingsScreen';
import getLocallySharedStylesSettingsScreens from '../../../styles/LocallySharedStylesSettingsScreens';

const SettingsScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesSettingsScreens(theme);

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { notificationsEnabled, setNotificationsEnabled, toggleNotifications } = useSettingsScreen();


    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.pageHeaderText}>Settings</Text>

            <View style={[sharedStyles.rowCenteredContainer, localStyles.maxWidthSmallMarginBottom]}>
                <Text style={[sharedStyles.generalText, sharedStyles.bigFont]}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme === 'dark' ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>

            <View style={[sharedStyles.rowCenteredContainer, localStyles.maxWidthSmallMarginBottom]}>
                <Text style={[sharedStyles.generalText, sharedStyles.bigFont]}>Notifications</Text>
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
                <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Log Out</Text>
            </TouchableOpacity>

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    );
};

export default SettingsScreen;
