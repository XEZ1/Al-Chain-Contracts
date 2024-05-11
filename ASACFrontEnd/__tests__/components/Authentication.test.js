import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AuthProvider, validateToken, login, signUp, logout } from '../../app/components/Authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert, LayoutAnimation } from 'react-native';


console.warn = () => {};


global.WebSocket = jest.fn(() => ({
    onopen: jest.fn(),
    onclose: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
    close: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve('mocked_token')),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn()
}));

// Simplified React Native mock without deprecated components
jest.mock('react-native', () => {
    const actualReactNative = jest.requireActual('react-native');
    return {
        ...actualReactNative,
        Alert: { alert: jest.fn() },
        LayoutAnimation: {
            configureNext: jest.fn(),
            Presets: {
                easeInEaseOut: 'easeInEaseOut'
            }
        },
    };
});

jest.mock('react-native/Libraries/Settings/Settings', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ token_valid: true }),
    ok: true,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('AuthProvider', () => {
    beforeEach(() => {
        fetch.mockClear();
        SecureStore.getItemAsync.mockClear();
        SecureStore.setItemAsync.mockClear();
        SecureStore.deleteItemAsync.mockClear();
        Alert.alert.mockClear();
        LayoutAnimation.configureNext.mockClear();
    });

    it('validateToken checks token validity', async () => {
        SecureStore.getItemAsync.mockResolvedValue('dummy-token');
        const valid = await validateToken();
        expect(valid).toBe(true);
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });

    it('handles token validation failure', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ token_valid: false }),
            ok: false,
        });
        const valid = await validateToken();
        expect(valid).toBe(false);
    });

    it('login sets token on success', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ token: 'new-token' }),
            ok: true,
        });
        const result = await login('username', 'password');
        expect(result).toEqual({ success: true, token: 'new-token' });
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'new-token');
    });

    it('signUp handles mismatched passwords', async () => {
        const result = await signUp('user', 'first', 'last', 'email@example.com', 'pass', 'pass2', {}, jest.fn());
        expect(result).toBeUndefined();
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
    });

    it('logout clears the token', async () => {
        await logout();
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
        expect(LayoutAnimation.configureNext).toHaveBeenCalledWith(LayoutAnimation.Presets.easeInEaseOut);
    });

    it('AuthProvider initializes with token validation', async () => {
        SecureStore.getItemAsync.mockResolvedValue('valid-token');
        const { getByText, findByText } = render(<AuthProvider><div>Child</div></AuthProvider>);
        await act(async () => { });
    
        // Optionally check for loading indicators first if present
        // await findByText('Loading...');
    
        const child = await findByText('Child');
        expect(child).toBeTruthy();
    });
    
});
