import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/PostLoginScreens/HomeScreen';

const Tab = createBottomTabNavigator();

const PostLoginTabs = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="1" component={HomeScreen} />
            <Tab.Screen name="2" component={HomeScreen} />
            <Tab.Screen name="3" component={HomeScreen} />
        </Tab.Navigator>
    );
};

export default PostLoginTabs;
