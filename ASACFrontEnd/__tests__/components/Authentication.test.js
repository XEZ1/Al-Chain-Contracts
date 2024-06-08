import React, { useContext } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext, AuthProvider, validateToken, login, signUp, logout, auth_request, auth_get, auth_post, auth_delete } from '../../app/components/Authentication';
import { act, renderHook } from '@testing-library/react-hooks';
import { WebSocketContext, WebSocketProvider, useWebSocket } from '../../app/components/Notifications';
import * as SecureStore from 'expo-secure-store';
import { Alert, Text } from 'react-native';

jest.mock('expo-secure-store');

global.fetch = jest.fn();

global.WebSocket = jest.fn().mockImplementation(() => ({
    onopen: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
    close: jest.fn(),
}));


describe('Authentication', () => {
    const mockSetErrors = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ token_valid: true }),
        });
        jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue('authToken');
        jest.spyOn(SecureStore, 'setItemAsync').mockResolvedValue(undefined);
        jest.spyOn(SecureStore, 'deleteItemAsync').mockResolvedValue(undefined);
        jest.spyOn(Alert, 'alert');
    });

    it('validates token successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token_valid: true }),
        });
        const isValid = await validateToken();
        expect(isValid).toBe(true);
    });

    it('handles token invalidation', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token_valid: false }),
        });
        const isValid = await validateToken();
        expect(isValid).toBe(false);
    });

    it('handles network errors gracefully', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockRejectedValue(new Error('Network Error'));
        const isValid = await validateToken();

        expect(isValid).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('alerts when required fields are missing', async () => {
        await signUp('', '', '', '', '', '', {}, mockSetErrors);

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all the fields below');
    });

    it('alerts when passwords do not match', async () => {
        await signUp('username', 'firstName', 'lastName', 'email@example.com', 'password1', 'password2', {}, mockSetErrors);

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
    });

    it('handles successful account creation (status 201)', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: () => Promise.resolve({}),
        });

        const result = await signUp('username', 'firstName', 'lastName', 'email@example.com', 'password', 'password', {}, mockSetErrors);
        
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created successfully');
        expect(result).toEqual({ success: true });
    });

    it('handles error response from server (status 400)', async () => {
        fetch.mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve({ message: 'Error from server' }),
        });

        const result = await signUp('username', 'firstName', 'lastName', 'email@example.com', 'password', 'password', {}, mockSetErrors);

        expect(mockSetErrors).toHaveBeenCalledWith({ message: 'Error from server' });
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fix the errors');
        expect(result).toEqual({ success: false, error: { message: 'Error from server' } });
    });

    it('handles error response from server (status 500)', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockResolvedValueOnce({
            status: 500,
            json: () => Promise.resolve({ }),
        });

        const result = await signUp('username', 'firstName', 'lastName', 'email@example.com', 'password', 'password', {}, mockSetErrors);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown error:', {});
        expect(result).toEqual({ success: false, error: {} });

        consoleErrorSpy.mockRestore();
    });

    it('handles network errors', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockRejectedValue(new Error('Network Error'));

        const result = await signUp('username', 'firstName', 'lastName', 'email@example.com', 'password', 'password', {}, mockSetErrors);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('returns error if username or password is missing', async () => {
        let result = await login('', 'password');
        expect(result).toEqual({ success: false, error: 'Username and password are required.' });

        result = await login('username', '');
        expect(result).toEqual({ success: false, error: 'Username and password are required.' });
    });

    it('handles successful login and stores token', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'valid-token' }),
        });

        const result = await login('username', 'password');
        expect(result).toEqual({ success: true, token: 'valid-token' });
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'valid-token');
    });

    it('handles unsuccessful login with server error message', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: 'Invalid credentials' }),
        });

        const result = await login('username', 'password');
        expect(result).toEqual({ success: false, error: 'Invalid credentials' });

        consoleLogSpy.mockRestore();
    });

    it('handles unsuccessful login without a specific server error message', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        });

        const result = await login('username', 'password');
        expect(result).toEqual({ success: false, error: 'An error occurred during login' });
    
        consoleLogSpy.mockRestore();
    });

    it('handles exceptions thrown during login', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockRejectedValue(new Error('Network Error'));

        const result = await login('username', 'password');
        expect(result).toEqual({ success: false, error: 'An unexpected error occurred' });
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('logs out successfully', async () => {
        await logout();
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
    });

    it('handles errors during logout', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        SecureStore.deleteItemAsync.mockRejectedValue(new Error('SecureStore Error'));

        await logout();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('renders children when logged in', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token_valid: true }),
        });

        const { getByText } = render(
            <AuthProvider>
                <Text>Test Child</Text>
            </AuthProvider>
        );

        await waitFor(() => expect(getByText('Test Child')).toBeTruthy());
    });

    it('renders children when not logged in', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token_valid: false }),
        });

        const { getByText } = render(
            <AuthProvider>
                <Text>Test Child</Text>
            </AuthProvider>
        );

        await waitFor(() => expect(getByText('Test Child')).toBeTruthy());
    });

    it('handleLogin calls login and updates isLoggedIn', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token_valid: true }),
        });

        const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper });

        act(() => {
            result.current.handleLogin('username', 'password');
        });

        await waitForNextUpdate();

        expect(result.current.isLoggedIn).toBeTruthy();
        expect(SecureStore.setItemAsync).toHaveBeenCalled();
    });

    it('handleLogin error on login', async () => {
        consoleLogSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ token_valid: false }),
        });
        
        const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper });

        act(() => {
            result.current.handleLogin('username', 'password');
        });

        await waitForNextUpdate();

        expect(result.current.success).not.toBeTruthy();

        consoleLogSpy.mockRestore();
    });

    it('handleSignUp calls signUp properly', async () => {
        const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper });

        fetch.mockResolvedValueOnce({
            ok: true,	
            status: 201,
            json: () => Promise.resolve({ success: true	 }),
        });

        act(() => {
            result.current.handleSignUp('username', 'John', 'Doe', 'john.doe@kcl.ac.uk', 'password', 'password', {}, jest.fn());
        });

        await waitForNextUpdate();

        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created successfully');
    });

    it('handleSignUp errors on handleSignUp', async () => {
        const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper });

        fetch.mockResolvedValueOnce({
            ok: false,	
            status: 400,
            json: () => Promise.resolve({ success: false }),
        });

        act(() => {
            result.current.handleSignUp('username', 'John', 'Doe', 'john.doe@kcl.ac.uk', 'password', 'password', {}, jest.fn());
        });

        await waitForNextUpdate();

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fix the errors');
    });

    it('handleLogout calls logout properly', async () => {
        const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), { wrapper });

        act(() => {
            result.current.handleLogout();
        });

        await waitForNextUpdate();

        expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });

    it('sends a request with the correct headers and method', async () => {
        const url = 'https://example.com/api/test';
        const token = 'fake-token';
        const body = JSON.stringify({ key: 'value' });
        const method = 'POST';
        const headers = { 'Content-Type': 'application/json' };

        SecureStore.getItemAsync.mockResolvedValue(token);
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });

        await auth_request(url, body, headers, method);

        expect(fetch).toHaveBeenCalledWith(url, {
            method,
            headers: {
                ...headers,
                'Authorization': `Token ${token}`,
            },
            body
        });
    });

    it('auth_get sends a GET request with correct headers', async () => {
        const url = 'https://example.com/api/resource';
        const body = JSON.stringify({ data: 'value' });
        const headers = { 'Accept': 'application/json' };
        const token = 'authToken';
        await auth_get(url, body, headers);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'GET',
            headers: {
                ...headers,
                'Authorization': `Token ${token}`
            },
            body
        });
    });

    it('auth_post sends a POST request with correct headers and body', async () => {
        const url = 'https://example.com/api/resource';
        const body = JSON.stringify({ data: 'value' });
        const headers = { 'Accept': 'application/json' };
        const token = 'authToken';
        await auth_post(url, body, headers);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Token ${token}`
            },
            body
        });
    });

    it('auth_delete sends a DELETE request with correct headers', async () => {
        const url = 'https://example.com/api/resource';
        const body = JSON.stringify({ data: 'value' });
        const headers = { 'Accept': 'application/json' };
        const token = 'authToken';
        await auth_delete(url, body, headers);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Authorization': `Token ${token}`
            },
            body
        });
    });

    it('auth_request sends a request with correct data & no body and headers', async () => {
        const url = 'https://example.com/api/resource';
        const token = 'authToken';
        await auth_request(url);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: undefined,
            headers: {
                'Authorization': `Token ${token}`
            },
            body: null
        });
    });

    it('auth_get sends a GET request with correct data & no body and headers', async () => {
        const url = 'https://example.com/api/resource';
        const token = 'authToken';
        await auth_get(url);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: null
        });
    });

    it('auth_post sends a POST request with correct data & no body and headers', async () => {
        const url = 'https://example.com/api/resource';
        const token = 'authToken';
        await auth_post(url);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: null
        });
    });

    it('auth_delete sends a DELETE request with correct & and no body and headers', async () => {
        const url = 'https://example.com/api/resource';
        const token = 'authToken';
        await auth_delete(url);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: null
        });
    });
});
