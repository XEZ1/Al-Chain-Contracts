import React, { useContext }  from 'react';
import PreLoginStack from './PreLoginStack';
import PostLoginTabs from './PostLoginTabs';
import { AuthContext } from '../components/Authentication';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const AppNavigator = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <SafeAreaProvider>
            {isLoggedIn ? <PostLoginTabs /> : <PreLoginStack />}
        </SafeAreaProvider>
    );
};

export default AppNavigator;