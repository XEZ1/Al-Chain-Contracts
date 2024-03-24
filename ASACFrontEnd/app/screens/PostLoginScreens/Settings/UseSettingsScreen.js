import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { deletePushToken, savePushToken } from '../../../components/Notifications';

export const useSettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const checkNotificationToken = async () => {
            const token = await SecureStore.getItemAsync('notificationToken');
            setNotificationsEnabled(!!token); 
        };

        checkNotificationToken();
    }, []);

    const toggleNotifications = async () => {

        const newStatus = !notificationsEnabled;
        setNotificationsEnabled(newStatus);

        if (newStatus) {
            const token = await Notifications.getExpoPushTokenAsync();
            savePushToken(token);
        } else {
            deletePushToken();
        }
    };

    return {notificationsEnabled, setNotificationsEnabled, toggleNotifications}
};