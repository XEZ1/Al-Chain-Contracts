import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeScreen } from '../../../../app/screens/PostLoginScreens/Home/UseHomeScreen';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';


jest.mock('expo-document-picker');

jest.mock('expo-secure-store');

jest.mock('expo-file-system', () => ({
    readAsStringAsync: jest.fn(() => Promise.resolve('file content')),
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: false })),
    readDirectoryAsync: jest.fn(() => Promise.resolve([])),
    deleteAsync: jest.fn(() => Promise.resolve()),
    documentDirectory: 'mocked/document/directory/',
    EncodingType: {
        UTF8: 'UTF8'
    },
}));

jest.mock('expo-sharing', () => ({
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    shareAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-clipboard', () => ({
    setStringAsync: jest.fn(() => Promise.resolve()),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    })
);

const mockNavigate = jest.fn();

describe('useHomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('handles file selection and cancellation correctly', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
          type: 'success',
          canceled: false,
          assets: [{ mimeType: 'text/plain', uri: 'file-uri' }],
        });
      
        const { result } = renderHook(() => useHomeScreen({ navigate: jest.fn() }));
        
        await act(async () => {
          await result.current.handleFileSelectDropZone();
        });
      
        expect(result.current.selectedFile).toBeDefined();
      
        DocumentPicker.getDocumentAsync.mockResolvedValue({
          canceled: true
        });
      
        await act(async () => {
          await result.current.handleFileSelectDropZone();
        });
      
        expect(result.current.selectedFile).toBeNull();
      });      

    it('should prevent uploading when there are validation errors', async () => {
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setErrors({ contractName: 'Invalid contract name' });
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).not.toHaveBeenCalled();
    });


    it('should handle contract upload correctly including validations', async () => {
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            SecureStore.getItemAsync.mockResolvedValue('dummy-token');
        });

        act(() => {
            result.current.setErrors({ contractName: 'Error' });
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).not.toHaveBeenCalled();

        act(() => {
            result.current.setErrors({});
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).toHaveBeenCalledWith('https://example.com/contracts/generate-contract/', expect.anything());
    });

    it('should handle errors in contract upload', async () => {
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            SecureStore.getItemAsync.mockResolvedValue('dummy-token');
            fetch.mockRejectedValue(new Error('Failed to fetch'));
        });

        await act(async () => {
            await result.current.uploadContractData();
        });
    });

    //it('fetches and syncs contracts', async () => {
    //    const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
    //    SecureStore.getItemAsync.mockResolvedValue('dummy-token');
    //  
    //    await act(async () => {
    //      await result.current.fetchAndSyncContracts();
    //    });
    //  
    //    expect(fetch).toHaveBeenCalled();
    //    expect(FileSystem.readDirectoryAsync).toHaveBeenCalled();
    //  });
      

});

describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
