import React, { useContext } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // If you're using Expo or you can use any other icon library
import HomeScreen from '../screens/PostLoginScreens/Home/HomeScreen';
import EditorScreen from '../screens/PostLoginScreens/Home/EditorScreen';
import ForumScreen from '../screens/PostLoginScreens/Forum/ForumScreen';
import { PostProvider } from '../screens/PostLoginScreens/Forum/UseForumScreen';
import CommentScreen from '../screens/PostLoginScreens/Forum/CommentScreen';
import SupportScreen from '../screens/PostLoginScreens/Support/SupportScreen';
import SettingsScreen from '../screens/PostLoginScreens/Settings/SettingsScreen';
import { ThemeContext } from '../components/Theme';
import themeStyles from '../styles/ThemeStyles';
import getGloballySharedStyles from '../styles/GloballySharedStyles';


// Create a bottom tab navigator for the post-login screens
const Tab = createBottomTabNavigator();

/**
 * PostLoginTabs component to manage the bottom tab navigation for the post-login screens.
 * This component contains the Home, Forum, Support, and Settings screens.
 * @returns {ReactElement} - The PostLoginTabs component
 * @exports PostLoginTabs
 */
const PostLoginTabs = () => {
    // Retrieve the current theme from the ThemeContext
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);

    // Create stack navigators for Home and Forum sections
    const HomeStack = createStackNavigator();
    const ForumStack = createStackNavigator();

    /**
     * Function to define the Home stack screens
     * @returns {ReactElement} - The Home stack navigator
     */
    function HomeStackScreen() {
        return (
            <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
                <HomeStack.Screen name="EditorScreen" component={EditorScreen} />
            </HomeStack.Navigator>
        );
    }

    /**
     * Function to define the Forum stack screens
     * @returns {ReactElement} - The Forum stack navigator
     */
    function ForumStackScreen() {
        return (
            <PostProvider>
                <ForumStack.Navigator initialRouteName="ForumScreen" screenOptions={{ headerShown: false }}>
                    <ForumStack.Screen name="ForumScreen" component={ForumScreen} />
                    <ForumStack.Screen name="CommentScreen" component={CommentScreen} />
                </ForumStack.Navigator>
            </PostProvider>
        );
    }

    /**
     * screenOptions function to define the screen options for the bottom tabs.
     * @param {object} { route }    
     * @returns {ReactElement} - The screen options for the bottom tabs + icons
     */
    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let testId;

            // Assign icon names and test IDs based on the route name
            switch (route.name) {
                case 'Home':
                    iconName = focused ? 'home' : 'home-outline';
                    testId = 'home-icon-test-ID';
                    break;
                case 'Forum':
                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    testId = 'forum-icon-test-ID';
                    break;
                case 'Support':
                    iconName = focused ? 'help-circle' : 'help-circle-outline';
                    testId = 'support-icon-test-ID';
                    break;
                case 'Settings':
                    iconName = focused ? 'settings' : 'settings-outline';
                    testId = 'settings-icon-test-ID';
                    break;
            }

            return (
                <Ionicons name={iconName} size={size} color={color} testID={testId} />
            );
        },
        tabBarStyle: sharedStyles.tabBar,
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS === 'android',
    });

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: themeStyles[theme].inputBackground }} testID='safeAreaViewTestID'>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} testID='statusBarTestID' />
            {/* Separator Line */}
            <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey' }} testID='topSeparatorLineTestID' />
            <View style={{ flex: 1 }}>
                <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
                    <Tab.Screen name="Home" component={HomeStackScreen} options={{ testID: 'homeTabTestID' }} />
                    <Tab.Screen name="Forum" component={ForumStackScreen} options={{ testID: 'forumTabTestID' }} />
                    <Tab.Screen name="Support" component={SupportScreen} options={{ testID: 'supportTabTestID' }} />
                    <Tab.Screen name="Settings" component={SettingsScreen} options={{ testID: 'settingsTabTestID' }} />
                </Tab.Navigator>
            </View>
        </SafeAreaView>
    );
};

export default PostLoginTabs;
