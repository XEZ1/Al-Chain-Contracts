import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { deletePushToken, savePushToken } from '../../../../app/components/Notifications';
import { useSettingsScreen } from '../../../../app/screens/PostLoginScreens/Settings/UseSettingsScreen';


jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn()
}));
jest.mock('expo-notifications', () => ({
    getExpoPushTokenAsync: jest.fn()
}));
jest.mock('../../../../app/components/Notifications', () => ({
    savePushToken: jest.fn(),
    deleteushToken: jest.fn()
}));

const mockSavePushToken = async () => {
    const token = 'mockToken';
    await SecureStore.setItemAsync('notificationToken', token);
};

const mockDeletePushToken = async () => {
    await SecureStore.deleteItemAsync('notificationToken');
};

//jest.mock('../../../../app/components/Notifications', () => ({
//    savePushToken: jest.fn(() => Promise.resolve()),
//    deletePushToken: jest.fn(() => Promise.resolve())
//}));

describe('useSettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'mockToken' });
        savePushToken.mockImplementation(() => SecureStore.setItemAsync('notificationToken', 'mockToken'));
        deletePushToken.mockImplementation(() => SecureStore.deleteItemAsync('notificationToken'));
    });
    
    //it('handles enabling notifications', async () => {
    //    const { result, waitForNextUpdate } = renderHook(() => useSettingsScreen());
    //    
    //    expect(result.current.notificationsEnabled).toBe(false);
    //    
    //    await act(async () => {
    //        result.current.savePushToken = mockSavePushToken;
    //        result.current.deletePushToken = mockDeletePushToken;
    //        
    //        await result.current.toggleNotifications();
    //        //await waitForNextUpdate(); 
    //    });
    //    
    //    expect(result.current.notificationsEnabled).toBe(true);
    //    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('notificationToken', 'mockToken');
    //    expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
    //});

    it('checks notification token on mount', async () => {
        SecureStore.getItemAsync.mockResolvedValue('mockToken');

        const { result, waitForNextUpdate } = renderHook(() => useSettingsScreen());

        await waitForNextUpdate();

        expect(result.current.notificationsEnabled).toBe(true);
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('notificationToken');
    })
    
    it('handles disabling notifications', async () => {
        SecureStore.getItemAsync.mockResolvedValue('mockToken');

        const { result, waitForNextUpdate } = renderHook(() => useSettingsScreen());
        await waitForNextUpdate();

        expect(result.current.notificationsEnabled).toBe(true);

        await act(async () => {
            await result.current.toggleNotifications();
        });

        expect(result.current.notificationsEnabled).toBe(false);
        expect(deletePushToken).toHaveBeenCalled();
    });
});
