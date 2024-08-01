import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';


/**
 * Custom hook to handle loading and displaying a file's content in a web view.
 * 
 * @param {string} filePath - The path to the file to be loaded.
 * @param {string} theme - The current theme ('dark' or 'light') to style the content accordingly.
 * @returns {Object} - An object containing the HTML code to display and the loading state.
 */
export const useEditorScreen = (filePath, theme) => {
    // State to hold the content of the file
    const [fileContent, setFileContent] = useState('');
    // State to hold the HTML code to be displayed in the WebView
    const [codeHtml, setCodeHtml] = useState('');
    // State to handle the loading status
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Load the content of the file when the filePath changes.
     */
    useEffect(() => {
        // Read the file content as a string
        const loadFileContent = async () => {
            try {
                const content = await FileSystem.readAsStringAsync(filePath);
                setFileContent(content);
            } catch (error) {
                // Show an alert if there's an error reading the file
                Alert.alert("Error", "Failed to load file content");
                console.error(error);
            }
        };

        loadFileContent();
    }, [filePath]);

    /**
     * Update the HTML template with the file content and theme styles when the file content or theme changes.
     */
    useEffect(() => {
        // Set background and text colors based on the current theme
        const backgroundColor = theme === 'dark' ? '#1A1A1A' : 'white';
        const textColor = theme === 'dark' ? 'white' : 'black';
        
        // Escape HTML characters in the file content
        const escapedContent = fileContent
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');

        // HTML template to display the file content with syntax highlighting
        const htmlTemplate = `
        <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-okaidia.min.css" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/components/prism-solidity.min.js"></script>
                <style>
                    body { 
                        background-color: ${backgroundColor} !important; 
                        color: ${textColor} !important; 
                        margin: 0; padding: 0; 
                        font-family: monospace; 
                        font-size: 16px;
                    }
                    pre { 
                        background-color: ${backgroundColor} !important;
                        white-space: pre-wrap !important; 
                        word-wrap: break-word !important; 
                        word-break: break-all !important;
                        overflow-wrap: break-word !important;
                        max-width: 100% !important;
                    }
                    pre code { 
                        background-color: ${backgroundColor} !important;
                        color: ${textColor} !important;
                        white-space: pre-wrap !important; 
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                    }
                    code {
                        display: block;
                        overflow-wrap: break-word !important;
                        word-wrap: break-word !important;
                        word-break: break-all !important;
                    }
                </style>
            </head>
            <body>
                <pre><code class="language-solidity">${escapedContent}</code></pre>
            </body>
        </html>`;
        setCodeHtml(htmlTemplate);
        setIsLoading(false);
    }, [theme, fileContent]); 
    
    return { codeHtml, isLoading };
};
