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
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/default.min.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
                <script>hljs.initHighlightingOnLoad();</script>
                <style>
                    body { 
                        background-color: ${backgroundColor} !important; 
                        color: ${textColor} !important; 
                        margin: 0; padding: 0px; 
                        font-family: monospace; 
                    }
                    pre { 
                        background-color: ${backgroundColor} !important;
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                    }
                    pre code { 
                        background-color: ${backgroundColor} !important;
                        color: ${textColor} !important;
                    }
                </style>
            </head>
            <body>
                <pre><code class="">${escapedContent}</code></pre>
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
