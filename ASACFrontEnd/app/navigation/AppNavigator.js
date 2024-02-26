import React from 'react';
import PreLoginStack from './PreLoginStack';
import PostLoginTabs from './PostLoginTabs';
import { useContext } from 'react';
import { AuthContext } from '../components/Authentication';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../components/Theme';


const AppNavigator = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    
    return (
        <SafeAreaProvider>
            {isLoggedIn ? <PostLoginTabs /> : <PreLoginStack />}
        </SafeAreaProvider>
        );
};

export default AppNavigator;