import { useEffect, useState, createContext, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';


export const WebSocketContext = createContext(null);

export const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onopen = () => console.log('WebSocket Connected');
        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "New Notification",
                    body: message.content,
                },
                trigger: null,
            });
        };
        ws.onerror = (e) => console.error(e.message);
        ws.onclose = (e) => console.log('WebSocket Disconnected', e.code, e.reason);
        setSocket(ws);

        return () => {
            ws && ws.close();
        };
    }, [url]);

    return socket;
};

export const WebSocketProvider = ({ children }) => {
    const socket = useWebSocket(`${BACKEND_URL.replace("https://", "wss://").replace("http://", "ws://")}/ws/notifications/`);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useConnectToNotifications = () => useContext(WebSocketContext);

export const savePushToken = async () => {
    try {
        const authToken = await SecureStore.getItemAsync('authToken');
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        const token = tokenResponse.data;
        await fetch(`${BACKEND_URL}/notifications/save-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
            body: JSON.stringify({ token }),
        });
        
        await SecureStore.setItemAsync('notificationToken', token);
        console.log('Push token saved');
    } catch (error) {
        console.error('Error saving push token:', error);
    }
};

export const deletePushToken = async () => {
    try {
        const authToken = await SecureStore.getItemAsync('authToken');
        await fetch(`${BACKEND_URL}/notifications/delete-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
        });

        await SecureStore.deleteItemAsync('notificationToken');
        console.log('Push token deleted');
    } catch (error) {
        console.error('Error deleting push token:', error);
    }
};

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

export default {
    savePushToken,
    deletePushToken,
    requestNotificationPermission,
};
