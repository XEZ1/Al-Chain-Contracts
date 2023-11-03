import React, { useState, useContext } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import { ThemeContext } from '../../components/Theme';
import getStyles from '../../styles/SharedStyles';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = getStyles(theme);  // Assuming your theme context provides a styles object

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { logout } = useContext(AuthContext);

  // Handle theme change
  const handleToggleTheme = () => {
    toggleTheme(); // Assuming toggleTheme switches between light and dark
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
    // TODO: Implement the function to save this notification setting
    // savePreference('notifications', !notificationsEnabled);
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
          thumbColor={theme.isDark ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggleTheme}
          value={theme.isDark}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      <Button
        title="Logout"
        color="#ff6347"
        onPress={handleLogout}
      />
    </View>
  );
};

export default SettingsScreen;
