import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/PostLoginScreens/HomeScreen';
import SettingsScreen from '../screens/PostLoginScreens/SettingsScreen';

const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="1" component={HomeScreen} />
            <Tab.Screen name="2" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default PostLoginTabs;
