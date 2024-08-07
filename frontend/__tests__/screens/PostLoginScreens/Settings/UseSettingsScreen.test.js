import { renderHook, act } from '@testing-library/react-hooks';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { waitFor } from '@testing-library/react';
import { deletePushToken, savePushToken } from '../../../../app/components/Notifications';
import { useSettingsScreen } from '../../../../app/screens/PostLoginScreens/Settings/UseSettingsScreen';


jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn()
}));

jest.mock('../../../../app/components/Notifications', () => ({
    savePushToken: jest.fn(),
    deletePushToken: jest.fn()
}));

describe('useSettingsScreen', () => {
    it('checks initial notifications setting', async () => {
        SecureStore.getItemAsync.mockResolvedValue(null);
        renderHook(() => useSettingsScreen());

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('notificationToken');
    });

    it('enables notifications and calls savePushToken', async () => {
        SecureStore.getItemAsync.mockResolvedValue(null);
        const { result, waitForNextUpdate } = renderHook(() => useSettingsScreen());

        await act(async () => {
            result.current.toggleNotifications(); 
        });

        expect(savePushToken).toHaveBeenCalled(); 
    });

    it('disables notifications and calls deletePushToken', async () => {
        SecureStore.getItemAsync.mockResolvedValue('existing-token');
        const { result, waitForNextUpdate } = renderHook(() => useSettingsScreen());

        await waitForNextUpdate();
        await act(async () => {
            result.current.toggleNotifications();
        });

        expect(deletePushToken).toHaveBeenCalled();
    });
});
