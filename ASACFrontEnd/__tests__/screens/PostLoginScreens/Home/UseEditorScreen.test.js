import { renderHook, act } from '@testing-library/react-hooks';
import { useEditorScreen } from '../../../../app/screens/PostLoginScreens/Home/UseEditorScreen';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { waitFor } from '@testing-library/react-native';


jest.mock('expo-file-system');

jest.mock('react-native', () => {
    return {
        Alert: {
            alert: jest.fn()
        }
    };
});

describe('useEditorScreen', () => {
    const initialFilePath = 'path/to/file.sol';
    const initialTheme = 'dark';
    const fileContent = 'function test() {}';
    const encodedFileContent = 'function test() {}';

    beforeEach(() => {
        FileSystem.readAsStringAsync.mockClear();
    });

    it('loads and sets file content on mount', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue(fileContent);

        const { result, waitForNextUpdate } = renderHook(() => useEditorScreen(initialFilePath, initialTheme));
        await waitForNextUpdate();

        expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(initialFilePath);
        expect(result.current.codeHtml).toContain(encodedFileContent);
        expect(result.current.isLoading).toBeFalsy();
    });

    it('alerts and logs an error when file reading fails', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        
        FileSystem.readAsStringAsync.mockRejectedValue(new Error('Failed to read file'));

        const { result } = renderHook(() => useEditorScreen(initialFilePath, initialTheme));

        await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to load file content"));
        expect(console.error).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('updates HTML correctly when theme changes', async () => {
        FileSystem.readAsStringAsync.mockResolvedValue(fileContent);

        const { result, rerender, waitForNextUpdate } = renderHook(({ filePath, theme }) => useEditorScreen(filePath, theme), {
            initialProps: { filePath: initialFilePath, theme: 'dark' }
        });

        await waitForNextUpdate();
        expect(result.current.codeHtml).toContain('#1A1A1A');

        rerender({ filePath: initialFilePath, theme: 'light' });

        expect(result.current.codeHtml).toContain('white');
        expect(result.current.isLoading).toBeFalsy();
    });

    it('handles encoding of special characters in file content', async () => {
        const specialContent = 'function test() { return "<test>"; }';
        const expectedEncodedContent = 'function test() { return &quot;&lt;test&gt;&quot;; }';
        FileSystem.readAsStringAsync.mockResolvedValue(specialContent);

        const { result, waitForNextUpdate } = renderHook(() => useEditorScreen(initialFilePath, initialTheme));
        await waitForNextUpdate();

        expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(initialFilePath);
        expect(result.current.codeHtml).toContain(expectedEncodedContent);
        expect(result.current.isLoading).toBeFalsy();
    });
});













describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
