import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeContext, ThemeProvider } from '../../app/components/Theme';
import * as SecureStore from 'expo-secure-store';


jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve(null)),
    setItemAsync: jest.fn(() => Promise.resolve()),
}));

describe('ThemeProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('provides the "light" theme as default', async () => {
        const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
        const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });
        expect(result.current.theme).toBe('light');
    });

    it('loads and sets theme from SecureStore during initialisation', async () => {
        SecureStore.getItemAsync.mockResolvedValue('dark');
        const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

        await act(async () => {
            const { result, waitForNextUpdate } = renderHook(() => React.useContext(ThemeContext), { wrapper });
            await waitForNextUpdate();
            expect(result.current.theme).toBe('dark');
        });

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('theme');
    });

    it('toggles theme from light to dark and updates SecureStore', async () => {
        SecureStore.getItemAsync.mockResolvedValue('light');
        const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

        await act(async () => {
            const { result, waitForNextUpdate } = renderHook(() => React.useContext(ThemeContext), { wrapper });
            await waitForNextUpdate();
            await result.current.toggleTheme();

            expect(result.current.theme).toBe('dark');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('theme', 'dark');
        });
    });

    it('toggles theme from dark to light and updates SecureStore', async () => {
        SecureStore.getItemAsync.mockResolvedValue('dark');
        const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

        await act(async () => {
            const { result, waitForNextUpdate } = renderHook(() => React.useContext(ThemeContext), { wrapper });
            await waitForNextUpdate();
            await result.current.toggleTheme();

            expect(result.current.theme).toBe('light');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('theme', 'light');
        });
    });

    it('checks for dark mode correctly', async () => {
        SecureStore.getItemAsync.mockResolvedValue('dark');
        const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

        await act(async () => {
            const { result, waitForNextUpdate } = renderHook(() => React.useContext(ThemeContext), { wrapper });
            await waitForNextUpdate();
            console.log('Checking dark mode:', result.current.isDarkMode);
            expect(result.current.isDarkMode).toBe(true);
        });
    });
});
