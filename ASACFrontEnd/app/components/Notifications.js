// notifications.js
import * as Notifications from 'expo-notifications';
import { useEffect, useContext, useState } from 'react';
import * as Device from 'expo-device';
import { BACKEND_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from './Authentication';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function getPushToken() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for notifications!');
        return null;
    }

    return (await Notifications.getExpoPushTokenAsync()).data;
}

async function saveOrDeleteToken(method, token = null) {
    const authToken = await SecureStore.getItemAsync('authToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
    };

    const body = method === 'POST' ? JSON.stringify({ token }) : undefined;

    const response = await fetch(`${BACKEND_URL}/push_token/`, {
        method,
        headers,
        body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error during push token ${method === 'POST' ? 'submission' : 'deletion'}:`, errorText);
    }
}

export async function registerForPushNotifications() {
    const token = await getPushToken();
    if (!token) return;

    if (Device.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    return token;
}

export async function savePushToken(token, isLoggedIn) {
    if (isLoggedIn) {
        await saveOrDeleteToken('POST', token);
    }
}

export async function deletePushToken(isLoggedIn) {
    if (isLoggedIn) {
        await saveOrDeleteToken('DELETE');
    }
}

export async function sendPushNotification(expoPushToken, title, body) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export async function schedulePushNotification(title, body, data, seconds) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: data,
        },
        trigger: { seconds: seconds },
    });
}

export function handleIncomingNotification() {
    Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification Received:', notification);
        // Handle the received notification
    });

    Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification Clicked:', response);
        // Handle the notification response (user clicked)
    });
}

export async function getNotificationStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
}


export function useNotification() {
    const { isLoggedIn } = useContext(AuthContext);
    const [notification, setNotification] = useState(null); // State to hold the latest notification

    useEffect(() => {
        if (!Device.isDevice) {
            console.warn("Must use physical device for Push Notifications");
            return;
        }

        async function setupNotifications() {
            const token = await registerForPushNotifications();
            if (token) {
                console.log('Notification Token:', token);
                await savePushToken(token, isLoggedIn);
            }

            const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification Received:', notification);
            });

            const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification Clicked:', response);
            });

            return () => {
                Notifications.removeNotificationSubscription(notificationSubscription);
                Notifications.removeNotificationSubscription(responseSubscription);
            };
        }

        setupNotifications();
    }, [isLoggedIn]);

    const renderNotification = () => {
        if (!notification) return null;

        // Extract the title and body from the notification
        const { title, body } = notification.request.content;

        // Your custom UI component or logic to display the notification
        // Here you'd return JSX to render or call a method to show a modal, toast, etc.
        return (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'lightblue', padding: '10px', textAlign: 'center' }}>
                <strong>{title}</strong> - {body}
            </div>
        );
    };

    // Return both the notification state and the render function from the hook
    return { notification, renderNotification };
}