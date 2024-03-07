import React, { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // If you're using Expo or you can use any other icon library
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/PostLoginScreens/HomeScreen';
import SettingsScreen from '../screens/PostLoginScreens/SettingsScreen';
import ForumScreen from '../screens/PostLoginScreens/ForumScreen';
import SupportScreen from '../screens/PostLoginScreens/SupportScreen';
import EditorScreen from '../screens/PostLoginScreens/EditorScreen';
import { ThemeContext } from '../components/Theme';
import getStyles from '../styles/SharedStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const HomeStack = createStackNavigator();

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
                <HomeStack.Screen name="EditorScreen" component={EditorScreen} />
            </HomeStack.Navigator>
        );
    }

    // Define screenOptions for icons and tab bar styles if you're using them
    const screenOptions = ({ navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (navigation.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (navigation.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (navigation.name === 'Forum') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (navigation.name === 'Support') {
                iconName = focused ? 'help-circle' : 'help-circle-outline';
            }

            return (
                <Ionicons name={iconName} size={size} color={color} />
            );
        },
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
                {/* Separator Line */}
                <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey' }} />
                <View style={{ flex: 1, Bottom: 80 }}>
                    <Tab.Navigator screenOptions={screenOptions}>
                        <Tab.Screen name="Home" component={HomeStackScreen} />
                        <Tab.Screen name="Forum" component={ForumScreen} />
                        <Tab.Screen name="Support" component={SupportScreen} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default PostLoginTabs;
