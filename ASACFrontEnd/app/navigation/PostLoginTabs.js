import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // If you're using Expo or you can use any other icon library
import HomeScreen from '../screens/PostLoginScreens/HomeScreen';
import SettingsScreen from '../screens/PostLoginScreens/SettingsScreen';
import ForumScreen from '../screens/PostLoginScreens/ForumScreen';
import { ThemeContext } from '../components/Theme';
import getStyles from '../styles/SharedStyles';

const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // Define screenOptions for icons and tab bar styles if you're using them
    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            }
            // Define icons for other tabs similarly...

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: styles.tabBar.activeTintColor,
        tabBarInactiveTintColor: styles.tabBar.inactiveTintColor,
        tabBarStyle: [
          {
            backgroundColor: styles.tabBar.backgroundColor,
            borderTopColor: styles.tabBar.borderColor,
          },
          null, // This is where you could put other styling as needed
        ],
        tabBarLabelStyle: {
            fontSize: 12,
        },
        headerShown: false,
        // Add other screenOptions as needed
    });

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="forum" component={ForumScreen} />
            <Tab.Screen name="support" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default PostLoginTabs;
