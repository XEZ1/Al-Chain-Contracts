import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const useEditorScreen = (filePath, theme) => {
    const [fileContent, setFileContent] = useState('');
    const [codeHtml, setCodeHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFileContent = async () => {
            try {
                const content = await FileSystem.readAsStringAsync(filePath);
                setFileContent(content);
            } catch (error) {
                Alert.alert("Error", "Failed to load file content");
                console.error(error);
            }
        };

        loadFileContent();
    }, [filePath]);

    useEffect(() => {
        const backgroundColor = theme === 'dark' ? '#1A1A1A' : 'white';
        const textColor = theme === 'dark' ? 'white' : 'black';
        const escapedContent = fileContent
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');

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
