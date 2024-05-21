import { renderHook, act } from '@testing-library/react-hooks';
import { useHomeScreen } from '../../../../app/screens/PostLoginScreens/Home/UseHomeScreen';
import { Alert, LayoutAnimation } from 'react-native';
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

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
    configureNext: jest.fn(),
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
            json: () => Promise.resolve({})
        });
    });

    it('handles successful file selection correctly with animation', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            type: 'success',
            canceled: false,
            assets: [{ mimeType: 'text/plain', uri: 'file-uri' }],
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setIsComponentMounted(true);
        });
        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeDefined();
        expect(LayoutAnimation.configureNext).toHaveBeenCalled();
    });

    it('handles file selection cancel with previous file selected with animation', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            canceled: true
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setIsComponentMounted(true);
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
        });

        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
        expect(LayoutAnimation.configureNext).toHaveBeenCalled();
    });

    it('handles successful file selection correctly without animation', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            type: 'success',
            canceled: false,
            assets: [{ mimeType: 'text/plain', uri: 'file-uri' }],
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setIsComponentMounted(false);
        });
        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeDefined();
        expect(LayoutAnimation.configureNext).not.toHaveBeenCalled();
    });

    it('handles file selection cancel with previous file selected without animation', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({
            canceled: true
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
        act(() => {
            result.current.setIsComponentMounted(false);
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
        });

        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
        expect(LayoutAnimation.configureNext).not.toHaveBeenCalled();
    });

    it('ignores cancel without a previous file selected', async () => {
        DocumentPicker.getDocumentAsync.mockResolvedValue({ canceled: true });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        await act(async () => {
            await result.current.handleFileSelectDropZone();
        });

        expect(result.current.selectedFile).toBeNull();
        expect(LayoutAnimation.configureNext).not.toHaveBeenCalled();
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
        expect(LayoutAnimation.configureNext).not.toHaveBeenCalled();
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

    it('handles contract upload correctly with animation when all conditions are met', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue('file content');
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ solidity_code: 'solidity code' })
        });
        LayoutAnimation.configureNext.mockImplementation((config) => {
            
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setIsComponentMounted(true);
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            result.current.setErrors({});
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
        expect(LayoutAnimation.configureNext).toHaveBeenCalled();
        expect(result.current.selectedFile).toBeNull();
        expect(result.current.contractName).toBe('');
        expect(result.current.employerAddress).toBe('');
        expect(result.current.authAppAddress).toBe('');
        expect(result.current.tokenContractInterface).toBe('');
    });

    it('handles contract upload correctly without animation when all conditions are met', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue('file content');
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ solidity_code: 'solidity code' })
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

        act(() => {
            result.current.setIsComponentMounted(false);
            result.current.setSelectedFile({ assets: [{ uri: 'file-uri' }] });
            result.current.setErrors({});
        });

        await act(async () => {
            await result.current.uploadContractData();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
        // we do not assert no call on animation because the subfunction saveSolidityFile actually calls another animation
        expect(result.current.selectedFile).not.toBeNull();
    });

    it('handles contract upload correctly when all conditions are met', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue('file content');
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ solidity_code: 'solidity code' })
        });

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

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

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));
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

        const { result } = renderHook(() => useHomeScreen({ navigate: mockNavigate }));

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

    it('successfully deletes a contract and updates state', async () => {
        const initialContracts = [
            { contract_name: 'contract1' },
            { contract_name: 'contract2' }
        ];
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
        const { result } = renderHook(() => useHomeScreen(mockNavigate));
    
        act(() => {
            result.current.setIsComponentMounted(true);
            result.current.setSavedContracts(initialContracts);
        });
    
        await act(async () => {
            await result.current.handleDeleteContract({ contract_name: 'contract1' });
        });
    
        expect(result.current.savedContracts).toEqual([{ contract_name: 'contract2' }]);
        expect(fetch).toHaveBeenCalledWith(`https://example.com/contracts/delete-contract/contract1/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token authToken`,
            },
        });
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith('mocked/document/directory/contract1.sol', { idempotent: true });
    
        consoleLogSpy.mockRestore();
    });

    it('deletes all files in the directory when there are multiple files', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        FileSystem.readDirectoryAsync.mockResolvedValue(['file1.sol', 'file2.sol', 'file3.sol']);
        FileSystem.deleteAsync.mockResolvedValue();

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        await act(async () => {
            await result.current.cleanExpoFolder();
        });

        expect(FileSystem.readDirectoryAsync).toHaveBeenCalledWith('mocked/document/directory/');
        expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(3);
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith('mocked/document/directory/file1.sol', { idempotent: true });
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith('mocked/document/directory/file2.sol', { idempotent: true });
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith('mocked/document/directory/file3.sol', { idempotent: true });

        consoleLogSpy.mockRestore();
    });

    it('handles an empty directory gracefully', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        FileSystem.readDirectoryAsync.mockResolvedValue([]);

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        await act(async () => {
            await result.current.cleanExpoFolder();
        });

        expect(FileSystem.readDirectoryAsync).toHaveBeenCalledWith('mocked/document/directory/');
        expect(FileSystem.deleteAsync).not.toHaveBeenCalled();

        consoleLogSpy.mockRestore();
    });

    it('returns true for valid JSON strings', () => {
        const validJson = '{"name":"John", "age":30, "city":"New York"}';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        expect(result.current.isValidJson(validJson)).toBeTruthy();
    });

    it('returns false for invalid JSON strings', () => {
        const invalidJson = '{"name":"John", "age":30, "city":New York"}';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        expect(result.current.isValidJson(invalidJson)).toBeFalsy();
    });

    it('returns false for non-string JSON like structures', () => {
        const nonStringJson = { name: "John", age: 30, city: "New York" };

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        expect(result.current.isValidJson(JSON.stringify(nonStringJson))).toBeTruthy();
        expect(result.current.isValidJson(nonStringJson)).toBeFalsy();
    });

    it('returns error for invalid Ethereum address for employer', () => {
        const invalidAddress = '0x123';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('employerAddress', invalidAddress);
        expect(errorMessage).toBe('Invalid Ethereum address. Must start with 0x followed by 40 hexadecimal characters.');
    });

    it('returns no error for valid Ethereum address for employer', () => {
        const validAddress = '0x99c805735C466c9B94762604612cfC961a48Eb03';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('employerAddress', validAddress);
        expect(errorMessage).toBe('');
    });

    it('returns error for invalid Ethereum address for authorised app', () => {
        const invalidAddress = '0x123';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('authAppAddress', invalidAddress);
        expect(errorMessage).toBe('Invalid Ethereum address. Must start with 0x followed by 40 hexadecimal characters.');
    });

    it('returns no error for valid Ethereum address for authorised app', () => {
        const validAddress = '0x99c805735C466c9B94762604612cfC961a48Eb03';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('authAppAddress', validAddress);
        expect(errorMessage).toBe('');
    });

    it('returns error for invalid contract name', () => {
        const invalidContractName = '1a';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('contractName', invalidContractName);
        expect(errorMessage).toBe('Invalid contract name. Must be 3-100 characters long and contain only letters, numbers, and spaces.');
    });

    it('returns no error for valid contract name', () => {
        const validContractName = 'ValidName';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('contractName', validContractName);
        expect(errorMessage).toBe('');
    });

    it('returns error for invalid Ethereum address for token interface', () => {
        const invalidAddress = '0x123';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('tokenContractInterface', invalidAddress);
        expect(errorMessage).toBe('Invalid token contract interface. Must be valid JSON.');
    });

    it('returns no error for valid Ethereum address for token interface', () => {
        const validAddress = '0x99c805735C466c9B94762604612cfC961a48Eb03';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('tokenContractInterface', validAddress);
        expect(errorMessage).toBe('');
    });

    it('returns error for invalid hexideciaml', () => {
        const invalidAddress = '012345ABCDEF';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('hexidecimal', invalidAddress);
        expect(errorMessage).toBe('Invalid Hexidecimal. Must start with 0x followed by some hexadecimal characters.');
    });

    it('returns no error for invalid hexideciaml', () => {
        const validAddress = '0x99c805735C466c9B94762604612cfC961a48Eb03';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('hexidecimal', validAddress);
        expect(errorMessage).toBe('');
    });

    it('returns default empty error message for unknown field', () => {
        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        const errorMessage = result.current.getValidationErrorMessage('unknownField', 'someValue');
        expect(errorMessage).toBe('');
    });

    it('Should set error message if validation fails', () => {
        const invalidAddress = '0x123';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.validateInput('tokenContractInterface', invalidAddress);
        });

        const { errors } = result.current;
        expect(errors.tokenContractInterface).toBe('Invalid token contract interface. Must be valid JSON.');
    });

    it('Should not set error message if validation passes', () => {
        const validAddress = '0x99c805735C466c9B94762604612cfC961a48Eb03';

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.validateInput('tokenContractInterface', validAddress);
        });

        const { errors } = result.current;
        expect(errors.tokenContractInterface).toBe('');
    });

    it('should handle checksum address correctly', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ address: 'verifiedAddress' }),
        });

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.setAddressChecksum('0x99c805735C466c9B94762604612cfC961a48Eb03');
        });

        await act(async () => {
            await result.current.handleChecksumAddress();
        });

        expect(result.current.validatedAddress).toBe('verifiedAddress');
        expect(result.current.showAddressModal).toBe(true);

        consoleLogSpy.mockRestore();
        fetch.mockClear();
    });

    it('should handle empty address checksum correctly', async () => {
        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.setAddressChecksum('');
        });

        await act(async () => {
            await result.current.handleChecksumAddress();
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error: Please fill the input field');
    });

    it('should handle backend error correctly', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ error: 'Backend Error' }),
        });

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.setAddressChecksum('0x123');
        });

        await act(async () => {
            await result.current.handleChecksumAddress();
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error: Backend Error');

        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
        fetch.mockClear();
    });

    it('should handle fetch error correctly', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        fetch.mockRejectedValueOnce(new Error('Fetch Error'));

        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.setAddressChecksum('0x123');
        });

        await act(async () => {
            await result.current.handleChecksumAddress();
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error verifying the address:', expect.any(Error));

        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
        fetch.mockClear();
    });

    it('should copy validated address to clipboard', async () => {
        const { result } = renderHook(() => useHomeScreen(mockNavigate));

        act(() => {
            result.current.setValidatedAddress('0x99c805735C466c9B94762604612cfC961a48Eb03');
        });

        act(() => {
            result.current.copyToClipboard();
        });

        expect(Clipboard.setStringAsync).toHaveBeenCalledWith('0x99c805735C466c9B94762604612cfC961a48Eb03');
        expect(Alert.alert).toHaveBeenCalledWith('Copied to clipboard!');
    });
});

//   99.43 |    93.75 |      96 |     100 | 46,55,99
describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
