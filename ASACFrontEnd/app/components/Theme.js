import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';


// Create a context to manage the theme state
export const ThemeContext = createContext();

/**
 * ThemeProvider component to manage and provide the theme state to the application.
 * @param {object} children - The child components to render within the provider.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // useEffect hook to load the saved theme from secure storage when the component mounts
    useEffect(() => {
        SecureStore.getItemAsync('theme').then(savedTheme => {
            if (savedTheme) {
                // Set the theme to the saved value if it exists
                setTheme(savedTheme);
            }
        });
    }, []);

    /**
     * Function to toggle the theme between 'light' and 'dark'.
     * The new theme is saved to secure storage.
     */
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        // Update the theme state
        setTheme(newTheme);
        // Save the new theme to secure storage
        await SecureStore.setItemAsync('theme', newTheme);
    };

    // Determine if the current theme is 'dark'
    const isDarkMode = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
