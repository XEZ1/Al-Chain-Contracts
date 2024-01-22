import React from 'react';
import PreLoginStack from './PreLoginStack';
import PostLoginTabs from './PostLoginTabs';
import { useContext } from 'react';
import { AuthContext } from '../components/Authentication';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ThemeContext } from '../components/Theme';


const AppNavigator = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor:  theme === 'dark' ? 'black' : 'white'}}>
                <View style={{ height: 3, backgroundColor: 'rgba(1, 193, 219, 1)' }} />
                <View style={{flex: 1, Bottom: 80}}>
                    {isLoggedIn ? <PostLoginTabs /> : <PreLoginStack />}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
        );
};

export default AppNavigator;