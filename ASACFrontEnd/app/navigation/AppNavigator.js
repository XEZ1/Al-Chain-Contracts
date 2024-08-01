import React, { useContext }  from 'react';
import PreLoginStack from './PreLoginStack';
import PostLoginTabs from './PostLoginTabs';
import { AuthContext } from '../components/Authentication';
import { SafeAreaProvider } from 'react-native-safe-area-context';


/**
 * AppNavigator component to manage the navigation stack based on authentication status
 * @returns {ReactElement} - Returns the appropriate navigation stack
 * @exports AppNavigator
 */
const AppNavigator = () => {
    // Retrieve the authentication status from the AuthContext
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <SafeAreaProvider>
            {isLoggedIn ? <PostLoginTabs testID="postLoginTabsTestID"/> : <PreLoginStack testID="preLoginStackTestID"/>}
        </SafeAreaProvider>
    );
};

export default AppNavigator;