import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import getStyles from '../../../styles/SharedStyles';
import { ThemeContext } from '../../../components/Theme';
import { WebView } from 'react-native-webview';
import { useEditorScreen } from './UseEditorScreen';

function EditorScreen({ route, navigation }) {  
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const { filePath } = route.params;
    const { codeHtml, isLoading } = useEditorScreen(filePath, theme);

    return (
        <View style={styles.baseContainer}>
            {isLoading ? (
                <ActivityIndicator size="large" color='rgba(1, 193, 219, 1)' style={styles.activityIndicator} /> 
            ) : (
                <View style={styles.EditorContainer}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: codeHtml }}
                        style={styles.editor}
                    />
                </View>
            )}
            {/* Separator Line */}
            <View style={styles.separatorLine} />
        </View>
    );
}

export default EditorScreen;
