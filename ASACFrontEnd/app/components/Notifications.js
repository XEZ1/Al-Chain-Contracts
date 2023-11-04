// notifications.js
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
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
    useEffect(() => {
        async function setupNotifications() {
            if (!Device.isDevice) {
                console.warn("Must use physical device for Push Notifications");
                return;
            }

            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn("Failed to get push token for push notification!");
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Notification Token:', token);

            // This is where we would register the token with our backend server

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

