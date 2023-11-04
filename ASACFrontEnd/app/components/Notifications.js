// notifications.js
import * as Notifications from 'expo-notifications';
import { useEffect, useContext, useState, useCallback } from 'react';
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

export async function registerForPushNotificationsAsync(isLoggedIn) {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250]
        });
    }

    return token;
}

export async function savePushToken(token, isLoggedIn) {
    console.log('reached')
    if (!isLoggedIn) {
        return;
    }

    const response = await fetch(`${BACKEND_URL}/push_token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${await SecureStore.getItemAsync('authToken')}`,
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        // Handle errors here
        const errorText = await response.text();
        console.error('Error submitting push token to backend:', errorText);
    }
}

export async function deletePushToken(isLoggedIn) {
    if (!isLoggedIn) {
        return;
    }

    const authToken = await SecureStore.getItemAsync('authToken');
    const response = await fetch(`${BACKEND_URL}/push_token/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
        },
    });

    if (!response.ok) {
        // Handle errors here
        const errorText = await response.text();
        console.error('Error deleting push token from backend:', errorText);
    } else {
        console.log('Push token deleted successfully.');
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

export function useNotification() {
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        async function setupNotifications() {
            if (!Device.isDevice) {
                console.warn("Must use physical device for Push Notifications");
                return;
            }

            let statusObj;

            // Only iOS needs to ask for permission explicitly.
            if (Device.osName === 'iOS') {
                statusObj = await Notifications.requestPermissionsAsync({
                    ios: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                    },
                });
            } else {
                statusObj = await Notifications.getPermissionsAsync(); // For Android, we check the current permissions status without prompting the user.
            }

            if (statusObj.status !== 'granted') {
                console.warn("Failed to get push token for push notification!");
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Notification Token:', token);

            // Save the token to the backend
            await savePushToken(token, isLoggedIn);

            // Listen for incoming notifications
            const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification Received:', notification);
            });

            // Listen for responses to notifications
            const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification Clicked:', response);
            });

            // Clear subscriptions on unmount
            return () => {
                Notifications.removeNotificationSubscription(notificationSubscription);
                Notifications.removeNotificationSubscription(responseSubscription);
            };
        }

        setupNotifications();
    }, []);
}