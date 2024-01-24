import { useEffect, useState } from 'react';
import { WebSocket } from 'react-native';
import * as Notifications from 'expo-notifications';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
const SERVER_URL = `${BACKEND_URL}/notifications`;


const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onopen = () => console.log('WebSocket Connected');
        ws.onmessage = (e) => handleIncomingMessage(JSON.parse(e.data));
        ws.onerror = (e) => console.error(e.message);
        ws.onclose = (e) => console.log('WebSocket Disconnected', e.code, e.reason);
        setSocket(ws);

        return () => ws.close();
    }, [url]);

    return socket;
};

const handleIncomingMessage = (message) => {
    Notifications.scheduleNotificationAsync({
        content: {
            title: "New Notification", 
            body: message.content, // Assuming message has a 'content' field
        },
        trigger: null, // Immediately show the notification
    });
};

export const connectToNotifications = (serverUrl) => {
    useWebSocket(serverUrl);
};

export const savePushToken = async () => {
    try {
        const authToken = await SecureStore.getItemAsync('authToken');
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        const token = tokenResponse.data;

        await fetch(`${SERVER_URL}/save-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            body: JSON.stringify({ token }),
        });
        console.log('Push token saved');
    } catch (error) {
        console.error('Error saving push token:', error);
    }
};

export const deletePushToken = async () => {
    try {
        const authToken = await SecureStore.getItemAsync('authToken');
        await fetch(`${SERVER_URL}/delete-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
        });
        console.log('Push token deleted');
    } catch (error) {
        console.error('Error deleting push token:', error);
    }
};

export default {
    connectToNotifications,
    savePushToken,
    deletePushToken,
};