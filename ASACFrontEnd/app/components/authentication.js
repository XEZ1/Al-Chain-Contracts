import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';
import React, { useState, useEffect, createContext } from 'react';
import { useConnectToNotifications } from './Notifications';
import { WebSocketProvider } from './Notifications';


export const AuthContext = createContext();

export const validateToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/validate_token/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        const data = await response.json();
        return response.ok && data.token_valid;
        /* if (!response.ok || !data.token_valid) {
            navigation.navigate('Login');
        } */
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export const login = async (username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            await SecureStore.setItemAsync('authToken', data.token);
            return { success: true, token: data.token };
        } else {
            return { success: false, error: data.error || 'An error occurred during login' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const logout = async () => {
    try {
        await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
        console.error('Error:', error);
    }
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            setIsLoggedIn(await validateToken());
        };

        checkToken();
    }, []);

    const handleLogin = async (username, password) => {
        const result = await login(username, password);
        if (result.success) {
            setIsLoggedIn(true);
        } else {
            console.error(result.error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogin }}>
            {isLoggedIn ? <WebSocketProvider>{children}</WebSocketProvider> : children}
        </AuthContext.Provider>
    );
};

export const auth_request = async (url, body = null, headers = {}, method) => {
    let token = await SecureStore.getItemAsync('authToken')
    return await fetchAPI(url, body, { ...headers, 'Authorization': 'Token ' + token }, method);
}

export const auth_get = async (url, body = null, headers = {},) => {
    return await auth_request(url, body, headers, "GET");
}
export const auth_post = async (url, body = null, headers = {}) => {
    return await auth_request(url, body, headers, "POST");
}

export const auth_delete = async (url, body = null, headers = {}) => {
    return await auth_request(url, body, headers, "DELETE");
}