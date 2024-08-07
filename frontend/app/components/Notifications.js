import { useEffect, useState, createContext, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';


// Create a context to manage WebSocket connection
export const WebSocketContext = createContext(null);

/**
 * Custom hook to initialise and manage a WebSocket connection.
 * @param {string} url - The WebSocket server URL to connect to.
 * @returns {WebSocket} - The WebSocket instance.
 */
export const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        /**
         * Initialise a WebSocket connection.
         * @type {WebSocket}
         */
        // Initialise a new WebSocket connection
        const ws = new WebSocket(url);
        ws.onopen = () => console.log('WebSocket Connected');

        // Handle incoming messages and display notifications
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

        // Handle WebSocket errors
        ws.onerror = (e) => console.error(e.message);

        // Handle WebSocket closure
        ws.onclose = (e) => console.log('WebSocket Disconnected', e.code, e.reason);
        
        setSocket(ws);

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            ws && ws.close();
        };
    }, [url]);

    return socket;
};

/**
 * WebSocketProvider component to provide the WebSocket context to the application.
 * @param {object} children - The child components to render within the provider.
 */
export const WebSocketProvider = ({ children }) => {
    // Create WebSocket connection URL based on the backend URL
    const socket = useWebSocket(`${BACKEND_URL.replace("https://", "wss://").replace("http://", "ws://")}/ws/notifications/`);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

/**
 * Custom hook to access the WebSocket context.
 * @returns {WebSocket} - The WebSocket instance from the context.
 */
export const useConnectToNotifications = () => useContext(WebSocketContext);

/**
 * Function to save the push notification token to the backend.
 */
export const savePushToken = async () => {
    try {
        // Retrieve the authentication token from secure storage
        const authToken = await SecureStore.getItemAsync('authToken');

        // Get the Expo push token
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        const token = tokenResponse.data;

        // Send the push token to the backend server
        await fetch(`${BACKEND_URL}/notifications/save-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
            body: JSON.stringify({ token }),
        });
        
        // Save the push token in secure storage
        await SecureStore.setItemAsync('notificationToken', token);
        console.log('Push token saved');
    } catch (error) {
        console.error('Error saving push token:', error);
    }
};

/**
 * Function to delete the push notification token from the backend.
 */
export const deletePushToken = async () => {
    try {
        // Retrieve the authentication token from secure storage
        const authToken = await SecureStore.getItemAsync('authToken');

        // Send a request to the backend to delete the push token
        await fetch(`${BACKEND_URL}/notifications/delete-token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
        });

        // Delete the push token from secure storage
        await SecureStore.deleteItemAsync('notificationToken');
        console.log('Push token deleted');
    } catch (error) {
        console.error('Error deleting push token:', error);
    }
};

/**
 * Function to request notification permissions from the user.
 * @returns {boolean} - Whether the notification permissions are granted.
 */
export const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

export default {
    savePushToken,
    deletePushToken,
    requestNotificationPermission,
};
