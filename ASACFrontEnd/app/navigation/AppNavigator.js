import React from 'react';
import PreLoginStack from './PreLoginStack';
import PostLoginTabs from './PostLoginTabs';
import { useContext } from 'react';
import { AuthContext } from '../components/Authentication';

const AppNavigator = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return isLoggedIn ? <PostLoginTabs /> : <PreLoginStack />;
};

export default AppNavigator;