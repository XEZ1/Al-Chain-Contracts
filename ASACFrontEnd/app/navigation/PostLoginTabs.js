import React, { useContext } from 'react';
import { View, StatusBar, LayoutAnimation, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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


const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);

    /* const handleTabPress = () => {
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }; */

    const HomeStack = createStackNavigator();
    const ForumStack = createStackNavigator();

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
                <HomeStack.Screen name="EditorScreen" component={EditorScreen} />
            </HomeStack.Navigator>
        );
    }

    function ForumStackScreen() {
        return (
            <PostProvider>
                <ForumStack.Navigator initialRouteName="ForumScreen" screenOptions={{ headerShown: false }}>
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
        tabBarStyle: sharedStyles.tabBar,
        headerShown: false,
        /* tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => { handleTabPress(); props.onPress(); }}>
                <View>{props.children}</View>
            </TouchableOpacity>
        ), */ 
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: themeStyles[theme].inputBackground }}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
                {/* Separator Line */}
                <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey' }} />
                <View style={{ flex: 1 }}>
                    <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
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
