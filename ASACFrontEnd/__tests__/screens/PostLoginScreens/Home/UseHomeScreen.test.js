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

    afterEach(() => {
        fetch.mockResolvedValue({
            json: () => Promise.resolve({}) // Adjust this response as necessary for your tests
        });
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
            SecureStore.getItemAsync.mockResolvedValue('authToken');
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


    it('successfully navigates to the EditorScreen with the correct file path', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        
        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        
        act(() => {
            result.current.openContract('testContract');
        });

        expect(mockNavigate).toHaveBeenCalledWith('EditorScreen', { filePath: 'mocked/document/directory/testContract.sol' });
    
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    it('handles errors when trying to open a contract file', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const navigateMock = jest.fn(() => { throw new Error('Navigation error'); });

        const { result } = renderHook(() => useHomeScreen({ navigate: navigateMock }));

        act(() => {
            result.current.openContract('testContract');
        });

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Could not open the contract file");
    
        consoleErrorSpy.mockRestore(); 
        consoleLogSpy.mockRestore();
    });
    

    it('successfully fetches and synchronizes contracts', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        
        const contractsMock = [{ contract_name: 'Contract1' }, { contract_name: 'Contract2' }];
        fetch.mockResolvedValue({
            json: () => Promise.resolve(contractsMock)
        });
        const syncContractsMock = jest.fn(() => Promise.resolve());

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate, syncContracts: syncContractsMock }));

        await act(async () => {
            await result.current.fetchAndSyncContracts();
        });

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('authToken');
        expect(fetch).toHaveBeenCalledWith(`https://example.com/contracts/get-user-contracts/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token authToken',
            },
        });

        consoleErrorSpy.mockRestore(); 
        consoleLogSpy.mockRestore();
    });

    it('handles errors if fetching contracts fails', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const error = new Error('Fetch failed');
        fetch.mockRejectedValue(error);

        const { result } = renderHook(() => useHomeScreen({ navigate: jest.fn() }));

        await act(async () => {
            await result.current.fetchAndSyncContracts();
        });

        expect(fetch).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Error fetching contracts:", error);
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to fetch contracts.");
        
        consoleErrorSpy.mockRestore(); 
        consoleLogSpy.mockRestore();
    });

    it('handles errors if token retrieval fails', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const error = new Error('Token retrieval failed');
        SecureStore.getItemAsync.mockRejectedValue(error);

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.fetchAndSyncContracts();
        });

        expect(SecureStore.getItemAsync).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Error fetching contracts:", error);
        expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to fetch contracts.");
    
        consoleErrorSpy.mockRestore(); 
        consoleLogSpy.mockRestore();
    });
    
    
    it('does nothing if all contracts are already saved locally', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        
        const contractsMock = [{ contract_name: 'Contract1' }];
        FileSystem.readDirectoryAsync.mockResolvedValue(['Contract1.sol']);

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate  }));

        await act(async () => {
            await result.current.syncContracts(contractsMock);
        });

        expect(FileSystem.readDirectoryAsync).toHaveBeenCalled();
        expect(FileSystem.writeAsStringAsync).not.toHaveBeenCalled();
        expect(result.current.savedContracts.length).toBe(1);

        consoleLogSpy.mockRestore();
    });

    it('downloads missing contracts', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        const contractsMock = [{ name: 'Contract1', contract_name: 'Contract1', code: 'code1' }];
        FileSystem.readDirectoryAsync.mockResolvedValue([]); 

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.syncContracts(contractsMock);
        });

        expect(FileSystem.readDirectoryAsync).toHaveBeenCalled();
        expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('does nothing if component is unmounted during contracts deletion', async () => {
        const { result } = renderHook(() => useHomeScreen(mockNavigate));
        act(() => {
            result.current.setIsComponentMounted(false);
        });

        await act(async () => {
            await result.current.handleDeleteContract({ contract_name: 'contract1' });
        });

        expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
    });

    it('successfully deletes a contract', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        SecureStore.getItemAsync.mockResolvedValue('authToken');

        const { result } = renderHook(() => useHomeScreen(mockNavigate));
        
        act(() => {
            result.current.setIsComponentMounted(true);
        });

        await act(async () => {
            await result.current.handleDeleteContract({ contract_name: 'contract1' });
        });

        expect(fetch).toHaveBeenCalledWith(`https://example.com/contracts/delete-contract/contract1/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token authToken`,
            },
        });
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith('mocked/document/directory/contract1.sol', { idempotent: true });
        expect(result.current.savedContracts).toEqual([]);

        consoleLogSpy.mockRestore();
    });

    it('handles backend API failure gracefully for contracts deletion', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockImplementationOnce(() => Promise.reject(new Error('API Failure')));
        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        await act(async () => {
            await result.current.handleDeleteContract({ contract_name: 'contract1' });
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error deleting the contract:', expect.anything());

        consoleErrorSpy.mockRestore(); 
    });

    it('handles local file deletion failure gracefully', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        
        FileSystem.deleteAsync.mockRejectedValueOnce(new Error('File Deletion Failure'));
        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        await act(async () => {
            await result.current.handleDeleteContract({ contract_name: 'contract1' });
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error deleting the contract:', expect.anything());
    
        consoleErrorSpy.mockRestore();
    });


});

//  69.78 |    55.81 |      56 |   72.25
describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
