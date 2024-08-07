import React, { useState, useEffect, createContext } from 'react';
import { LayoutAnimation, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';
import { WebSocketProvider } from './Notifications';
import { savePushToken, deletePushToken } from './Notifications';


// Create a context to manage authentication state and methods
export const AuthContext = createContext();

/**
 * Validate the user's authentication token by making a request to the backend.
 * @returns {boolean} - Returns true if the token is valid, otherwise false.
 */
export const validateToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/validate-token/`, {
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

/**
 * Register a new user by sending their details to the backend.
 * @param {string} username - The username of the new user.
 * @param {string} firstName - The first name of the new user.
 * @param {string} lastName - The last name of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new account.
 * @param {string} passwordConfirmation - The confirmation of the password.
 * @param {object} errors - Object to hold form errors.
 * @param {function} setErrors - Function to update the form errors.
 * @returns {object} - Returns an object with a success status and any errors.
 */
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

        const response = await fetch(`${BACKEND_URL}/sign-up/`, {
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
        } else {
            console.error('Unknown error:', data);
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

/**
 * Log in an existing user by sending their credentials to the backend.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {object} - Returns an object with a success status and any errors.
 */
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

/**
 * Log out the current user by deleting their authentication token.
 */
export const logout = async () => {
    try {
        await deletePushToken();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
        console.error('Error:', error);
    }
};

/**
 * AuthProvider component to provide authentication context to the application.
 * @param {object} children - The child components to render within the provider.
 */
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        /** 
         * Check if the user is logged in by validating their token.
         * If the token is valid, set the state to true, otherwise false.
         */
        const checkToken = async () => {
            setIsLoggedIn(await validateToken());
        };

        checkToken();
    }, []);

    /**
     * Handle user login by calling the login function and updating the state.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     */
    const handleLogin = async (username, password) => {
        const result = await login(username, password);
        if (result.success) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsLoggedIn(true);
        } else {
            Alert.alert('Login Failed', result.error);
            console.error(result.error);
        }
    };

    /**
     * Handle user registration by calling the signUp function and then logging in the user.
     * @param {string} username - The username of the new user.
     * @param {string} firstName - The first name of the new user.
     * @param {string} lastName - The last name of the new user.
     * @param {string} email - The email address of the new user.
     * @param {string} password - The password for the new account.
     * @param {string} passwordConfirmation - The confirmation of the password.
     * @param {object} errors - Object to hold form errors.
     * @param {function} setErrors - Function to update the form errors.
     */
    const handleSignUp =  async (username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors) => {
        const result = await signUp(username, firstName, lastName, email, password, passwordConfirmation, errors, setErrors);
        if (result.success) {
            handleLogin(username, password);
        } else {
            console.error(result.error);
        }
    };

    /**
     * Handle user logout by calling the logout function and updating the state.
     */
    const handleLogout = async () => {
        await logout();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogin, handleSignUp, handleLogout }}>
            {isLoggedIn ? <WebSocketProvider>{children}</WebSocketProvider> : children}
        </AuthContext.Provider>
    );
};

/**
 * Perform an authenticated request to the specified URL with the given method and headers.
 * @param {string} url - The URL to send the request to.
 * @param {object} body - The body of the request.
 * @param {object} headers - The headers of the request.
 * @param {string} method - The HTTP method to use for the request.
 * @returns {object} - The response from the server.
 */
export const auth_request = async (url, body = null, headers = {}, method) => {
    let token = await SecureStore.getItemAsync('authToken')
    const options = {
        method: method,
        headers: {
            ...headers,
            'Authorization': `Token ${token}`
        },
        body: body
    };
    return await fetch(url, options);
}

/**
 * Perform an authenticated GET request to the specified URL with the given headers.
 * @param {string} url - The URL to send the request to.
 * @param {object} body - The body of the request.
 * @param {object} headers - The headers of the request.
 * @returns {object} - The response from the server.
 */
export const auth_get = async (url, body = null, headers = {},) => {
    return await auth_request(url, body, headers, "GET");
}

/**
 * Perform an authenticated POST request to the specified URL with the given headers and body.
 * @param {string} url - The URL to send the request to.
 * @param {object} body - The body of the request.
 * @param {object} headers - The headers of the request.
 * @returns {object} - The response from the server.
 */
export const auth_post = async (url, body = null, headers = {}) => {
    return await auth_request(url, body, headers, "POST");
}

/**
 * Perform an authenticated DELETE request to the specified URL with the given headers and body.
 * @param {string} url - The URL to send the request to.
 * @param {object} body - The body of the request.
 * @param {object} headers - The headers of the request.
 * @returns {object} - The response from the server.
 */
export const auth_delete = async (url, body = null, headers = {}) => {
    return await auth_request(url, body, headers, "DELETE");
}
