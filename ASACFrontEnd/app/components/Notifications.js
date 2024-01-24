import { useEffect, useState } from 'react';
import { WebSocket } from 'react-native';
import PushNotification from 'react-native-push-notification';

const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to WebSocket
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (e) => {
            // Handle incoming message
            const message = JSON.parse(e.data);
            handleNotification(message);
        };

        ws.onerror = (e) => {
            console.error(e.message);
        };

        ws.onclose = (e) => {
            console.log('WebSocket Disconnected', e.code, e.reason);
        };

        setSocket(ws);

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, [url]);

    return socket;
};

const handleNotification = (message) => {
    // Display local notification
    PushNotification.localNotification({
        title: "New Message",
        message: message.content, // Assuming message has a 'content' field
    });
};

export const connectToNotifications = (serverUrl) => {
    useWebSocket(serverUrl);
};

export default {
    connectToNotifications,
};