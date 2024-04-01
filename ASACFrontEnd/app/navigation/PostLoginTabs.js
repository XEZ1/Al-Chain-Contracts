import React, { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // If you're using Expo or you can use any other icon library
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/PostLoginScreens/Home/HomeScreen';
import SettingsScreen from '../screens/PostLoginScreens/Settings/SettingsScreen';
import ForumScreen from '../screens/PostLoginScreens/Forum/ForumScreen';
import CommentScreen from '../screens/PostLoginScreens/Forum/CommentScreen';
import SupportScreen from '../screens/PostLoginScreens/Support/SupportScreen';
import EditorScreen from '../screens/PostLoginScreens/Home/EditorScreen';
import { ThemeContext } from '../components/Theme';
import getStyles from '../styles/SharedStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { PostProvider } from '../screens/PostLoginScreens/Forum/UseForumScreen';

const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const HomeStack = createStackNavigator();
    const ForumStack = createStackNavigator();

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
                <HomeStack.Screen name="EditorScreen" component={EditorScreen} />
            </HomeStack.Navigator>
        );
    }

    function ForumStackScreen() {
        return (
            <PostProvider>
                <ForumStack.Navigator screenOptions={{ headerShown: false }}>
                    <HomeStack.Screen name="ForumScreen" component={ForumScreen} />
                    <HomeStack.Screen name="CommentScreen" component={CommentScreen} />
                </ForumStack.Navigator>
            </PostProvider>
        );
    }

    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Forum') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Support') {
                iconName = focused ? 'help-circle' : 'help-circle-outline';
            }

            return (
                <Ionicons name={iconName} size={size} color={color} />
            );
        },
        tabBarStyle: styles.tabBar,
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
                        <Tab.Screen name="Forum" component={ForumStackScreen} />
                        <Tab.Screen name="Support" component={SupportScreen} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default PostLoginTabs;
