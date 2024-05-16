/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen } from '@testing-library/react';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { WebSocketContext, useWebSocket, WebSocketProvider, useConnectToNotifications, savePushToken, deletePushToken, requestNotificationPermission } from '../../app/components/Notifications';


jest.mock('expo-notifications');

jest.mock('expo-secure-store');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ data: 'mocked' })
    })
);

global.WebSocket = jest.fn().mockImplementation(() => ({
    onopen: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
    close: jest.fn(),
    useWebSocket: jest.fn(),
}));

describe('WebSocket and Notifications Handling', () => {

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();

    });

    it('should use the correct BACKEND_URL', () => {
        expect(process.env.BACKEND_URL).toBe('https://example.com');
    });

    it('opens and closes WebSocket correctly', async () => {
        const { result, unmount } = renderHook(() => useWebSocket('wss://example.com/ws/notifications/'));

        act(() => {
            result.current.onopen();
        });

        expect(console.log).toHaveBeenCalledWith('WebSocket Connected');

        act(() => {
            result.current.onclose({ code: 1000, reason: 'Normal closure' });
            unmount();
        });

        expect(console.log).toHaveBeenCalledWith('WebSocket Disconnected', expect.any(Number), expect.any(String));
    });

    //it('provides a WebSocket connection', () => {
    //    const testUrl = 'wss://example.com/ws/notifications/';
//
    //    const mockUseWebSocket = jest.spyOn(require('../../app/components/Notifications'), 'useWebSocket');
    //    mockUseWebSocket.mockImplementation(() => ({
    //        send: jest.fn(),
    //        close: jest.fn(),
    //    }));
//
    //    const children = <div>Test Children</div>;
    //    const { getByText } = render(
    //        <WebSocketProvider>
    //            {children}
    //        </WebSocketProvider>
    //    );
//
    //    expect(mockUseWebSocket).toHaveBeenCalledWith(testUrl);
    //    expect(getByText('Test Children')).toBeInTheDocument();
//
    //    mockUseWebSocket.mockRestore();
    //});

    it('handles incoming WebSocket messages and schedules notifications', async () => {
        const { result } = renderHook(() => useWebSocket('wss://example.com/ws/notifications/'));

        act(() => {
            result.current.onmessage({ data: JSON.stringify({ content: 'Hello World' }) });
        });

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
            content: {
                title: "New Notification",
                body: 'Hello World',
            },
            trigger: null,
        });
    });

    it('handles errors when saving push token', async () => {
        Notifications.getExpoPushTokenAsync.mockRejectedValue(new Error('Failed to get push token'));
        const consoleSpy = jest.spyOn(console, 'error');

        await act(async () => {
            await savePushToken();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Error saving push token:', expect.any(Error));
    });

    it('handles errors when deleting push token', async () => {
        SecureStore.getItemAsync.mockRejectedValue(new Error('Failed to get auth token'));
        const consoleSpy = jest.spyOn(console, 'error');

        await act(async () => {
            await deletePushToken();
        });

        expect(consoleSpy).toHaveBeenCalledWith('Error deleting push token:', expect.any(Error));
    });

    it('saves push token correctly', async () => {
        Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'token123' });
        SecureStore.getItemAsync.mockResolvedValue('authToken123');

        await act(async () => {
            await savePushToken();
        });

        expect(fetch).toHaveBeenCalledWith('https://example.com/notifications/save-token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token authToken123',
            },
            body: JSON.stringify({ token: 'token123' }),
        });
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('notificationToken', 'token123');
        expect(console.log).toHaveBeenCalledWith('Push token saved');
    });

    it('deletes push token correctly', async () => {
        SecureStore.getItemAsync.mockResolvedValue('authToken123');

        await act(async () => {
            await deletePushToken();
        });

        expect(fetch).toHaveBeenCalledWith('https://example.com/notifications/delete-token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token authToken123',
            },
        });
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('notificationToken');
        expect(console.log).toHaveBeenCalledWith('Push token deleted');
    });

    it('requests notification permission and returns status', async () => {
        Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });

        const permissionStatus = await requestNotificationPermission();
        expect(permissionStatus).toBe(true);
    });
});
