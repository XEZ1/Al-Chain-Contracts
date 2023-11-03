import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Load the saved theme from storage when the app starts
        SecureStore.getItemAsync('theme').then(savedTheme => {
            if (savedTheme) {
                setTheme(savedTheme);
            }
        });
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await SecureStore.setItemAsync('theme', newTheme);
    };

    const isDarkMode = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
