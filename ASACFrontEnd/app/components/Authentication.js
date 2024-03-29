import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';
import React, { useState, useEffect, createContext } from 'react';
import { useConnectToNotifications } from './Notifications';
import { WebSocketProvider } from './Notifications';
import { Alert } from 'react-native';


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
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export const signUp = async (username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors) => {
    try {
        if (!username || !firstName || !lastName || !email || !password || !passwordConfirmation) {
            Alert.alert('Error', 'Please fill in all the fields below');
            return;
        }
        if (password !== passwordConfirmation) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const response = await fetch(`${BACKEND_URL}/sign_up/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
            }),
        });

        const data = await response.json();

        if (response.status === 400) {
            setErrors(data);
            Alert.alert('Error', 'Please fix the errors');
            return { success: false, error: data };
        } else if (response.status === 201) {
            Alert.alert('Success', 'Account created successfully');
            return { success: true };
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const login = async (username, password) => {
    try {
        if (!username || !password) {
            return { success: false, error: 'Username and password are required.' };
        }

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
            Alert.alert('Login Failed', result.error);
            console.log(result.error);
        }
    };

    const handleSignUp =  async (username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors) => {
        const result = await signUp(username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors);
        if (result.success) {
            handleLogin(username, password);
        } else {
            console.log(result.error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogin, handleSignUp }}>
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
