import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { deletePushToken, savePushToken } from '../../../components/Notifications';


export const useSettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const checkNotificationToken = async () => {
            const token = await SecureStore.getItemAsync('notificationToken');
            console.log(token);
            setNotificationsEnabled(!!token)
        };

        checkNotificationToken();
    }, []);

    const toggleNotifications = async () => {

        const newStatus = !notificationsEnabled;
        setNotificationsEnabled(newStatus);

        if (newStatus) {
            await savePushToken();
        } else {
            await deletePushToken();
        }
    };

    return {notificationsEnabled, setNotificationsEnabled, toggleNotifications}
};