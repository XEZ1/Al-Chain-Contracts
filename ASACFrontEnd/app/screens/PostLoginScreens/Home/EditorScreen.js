import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Ensure you're importing FileSystem
import getStyles from '../../../styles/SharedStyles';
import { Theme } from '@react-navigation/native';
import { ThemeContext } from '../../../components/Theme';

function EditorScreen({ route, navigation }) { // Destructure 'route' from props
    const { filePath } = route.params; // Correctly access 'filePath' from 'route.params'
    const [fileContent, setFileContent] = useState('');
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);

    useEffect(() => {
        const loadFileContent = async () => {
            try {
                const content = await FileSystem.readAsStringAsync(filePath);
                setFileContent(content);
            } catch (error) {
                Alert.alert("Error", "Failed to load the contract content");
                console.error("Failed to read file content", error);
            }
        };

        loadFileContent();
    }, [filePath]);

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <View style={styles.EditorContainer}>
                <TextInput
                    style={styles.editor} theme={theme}
                    multiline
                    editable
                    value={fileContent}
                    onChangeText={setFileContent} // Allows editing, remove if read-only
                />

                {/* Separator Line */}
                <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
            </View>
        </View>
    );
}

export default EditorScreen;
