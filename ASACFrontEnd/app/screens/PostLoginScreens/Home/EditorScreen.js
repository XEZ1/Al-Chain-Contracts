import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Ensure you're importing FileSystem
import getStyles from '../../../styles/SharedStyles';
import { Theme } from '@react-navigation/native';
import { ThemeContext } from '../../../components/Theme';
import { WebView } from 'react-native-webview';

function EditorScreen({ route, navigation }) { // Destructure 'route' from props
    const { filePath } = route.params; // Correctly access 'filePath' from 'route.params'
    const [fileContent, setFileContent] = useState('');
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [codeHtml, setCodeHtml] = useState('');


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
        // Dynamically adjust the HTML content based on the theme
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
    }, [theme, fileContent]); // React to changes in theme or file content

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <View style={styles.EditorContainer}>

                { /* <TextInput
                    style={styles.editor} theme={theme}
                    multiline
                    editable
                    value={fileContent}
                    onChangeText={setFileContent} // Allows editing, remove if read-only
                /> */ }
                <WebView
                    originWhitelist={['*']}
                    source={{ html: codeHtml }}
                    style={styles.editor}
                />

                {/* Separator Line */}
                <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
            </View>
        </View>
    );
}

export default EditorScreen;
