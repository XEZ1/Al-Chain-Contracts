import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { deletePushToken, savePushToken } from '../../../components/Notifications';


/**
 * Custom hook to manage settings screen state and behaviour, specifically for notification preferences.
 * @returns {object} An object containing the state and functions for the settings screen.
 */
export const useSettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        /**
         * Check if a notification token is stored, indicating that notifications are enabled.
         * This runs when the component mounts.
         */
        const checkNotificationToken = async () => {
            const token = await SecureStore.getItemAsync('notificationToken');
            setNotificationsEnabled(!!token)
        };

        checkNotificationToken();
    }, []);

    /**
     * Toggle the notification status.
     * If notifications are being enabled, it saves the push token.
     * If notifications are being disabled, it deletes the push token.
     */
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