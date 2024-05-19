import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeScreen } from '../../../../app/screens/PostLoginScreens/Home/UseHomeScreen';
import { Alert } from 'react-native';
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

    it('handles successful file selection correctly', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            type: 'success',
            canceled: false,
            assets: [{ mimeType: 'text/plain', uri: 'file-uri' }],
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeDefined();
    });

    it('handles file selection cancel with previous file selected', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            canceled: true
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
        });

        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
    });

    it('ignores cancel without a previous file selected', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({ canceled: true });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
    });

    it('does not select a file if MIME type is not text/plain', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            type: 'success',
            canceled: false,
            assets: [{ mimeType: 'application/pdf', uri: 'file-uri' }],
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
    });

    it('handles errors during file selection', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        DocumentPicker.getDocumentAsync.mockRejectedValue(new Error('Failed to select file'));

        const alertSpy = jest.spyOn(Alert, 'alert');
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(alertSpy).toHaveBeenCalledWith("Error", "An error occurred during file selection.");

        consoleSpy.mockRestore();
    });


    it('should prevent uploading when there are validation errors on various fields', async () => {
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setErrors({ contractName: 'Invalid contract name' });
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Validation Errors", "Please fix the errors before proceeding.");
    });

    it('alerts if no file is selected before uploading', async () => {
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setSelectedFile(null);
            result.current.setErrors({});
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Please select a file before creating a contract.");
    });

    it('handles contract upload correctly when all conditions are met', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue('file content');
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ solidity_code: 'solidity code' })
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: jest.fn() }));

        act(() => {
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            result.current.setErrors({});
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(FileSystem.readAsStringAsync).toHaveBeenCalled();

    });

    it('handles errors during the upload process', async () => {
        const error = new Error('Upload failed');
        fetch.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useHomeScreen({ navigate: jest.fn() }));
        act(() => {
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            result.current.setErrors({});
            SecureStore.getItemAsync.mockResolvedValue('authToken');
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Upload Error", "An error occurred while uploading contract data.");
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

    it('saves a new Solidity file when it does not exist', async () => {
        FileSystem.getInfoAsync.mockResolvedValue({ exists: false });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.saveSolidityFile('solidity code', 'newContract');
        });

        expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
            'mocked/document/directory/newContract.sol',
            'solidity code',
            { encoding: FileSystem.EncodingType.UTF8 }
        );
        expect(Alert.alert).toHaveBeenCalledWith("Success", "Contract was generated and saved as newContract.sol to mocked/document/directory/newContract.sol");
    });

    it('overwrites an existing Solidity file', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });


        FileSystem.getInfoAsync.mockResolvedValue({ exists: true });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.saveSolidityFile('solidity code', 'existingContract');
        });

        expect(console.log).toHaveBeenCalledWith("existingContract.sol already exists. Overwriting...");
        expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Success", "Contract was generated and saved as existingContract.sol to mocked/document/directory/existingContract.sol");

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('handles an error when saving a file', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });


        const error = new Error('Failed to write file');
        FileSystem.writeAsStringAsync.mockRejectedValue(error);

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.saveSolidityFile('solidity code', 'faultyContract');
        });

        expect(console.error).toHaveBeenCalledWith("Error saving Solidity file:", error.message);
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to save the contract file.");

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('successfully shares a contract when sharing is available', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.shareContract('testContract');
        });

        expect(Sharing.shareAsync).toHaveBeenCalledWith('mocked/document/directory/testContract.sol');
        
        consoleLogSpy.mockRestore();
    });

    it('alerts user when sharing is not available on the device', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        
        Sharing.isAvailableAsync.mockResolvedValue(false);

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.shareContract('testContract');
        });

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Sharing not available on this device");
        expect(Sharing.shareAsync).not.toHaveBeenCalled();
    
        consoleLogSpy.mockRestore();
    });

    it('handles errors if sharing fails', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        Sharing.isAvailableAsync.mockResolvedValue(true)
        const error = new Error('Sharing error');
        Sharing.shareAsync.mockRejectedValue(error);

        Sharing.isAvailableAsync().then((available) => console.log('Sharing available:', available));
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.shareContract('testContract');
        });

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Could not share the contract file.");
        expect(console.error).toHaveBeenCalledWith(error);

        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
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

//46.99 |    41.86 |      32 |   48.27
describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
