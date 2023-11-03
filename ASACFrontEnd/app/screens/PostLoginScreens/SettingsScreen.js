import React, { useState, useContext } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../components/Authentication';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';

const SettingsScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  // This state would actually come from some global state/context or persistent storage
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const { logout } = useContext(AuthContext);

  const toggleDarkMode = () => {
    // Save preference to state or persistent storage
    setIsDarkMode(previousState => !previousState);
    // TODO: Implement the function to save this preference
    // savePreference('darkMode', !isDarkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
    // TODO: Implement the function to save this notification setting
    // savePreference('notifications', !notificationsEnabled);
  };

  const handleLogout = async () => {
    // Perform the logout
    await logout();
    // Navigate to login or any other screen if needed
    // navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  settingText: {
    fontSize: 18,
  }
});

export default SettingsScreen;
