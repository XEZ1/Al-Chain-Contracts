import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import { ThemeContext } from '../../../components/Theme';
import { WebView } from 'react-native-webview';
import { useEditorScreen } from './UseEditorScreen';
import getLocallySharedStylesHomeScreens from '../../../styles/LocallySharedStylesHomeScreens';

function EditorScreen({ route, navigation }) {  
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesHomeScreens(theme); 

    const { filePath } = route.params;
    const { codeHtml, isLoading } = useEditorScreen(filePath, theme);

    return (
        <View style={[sharedStyles.avoidingTabBarContainer, localStyles.zeroMaringBottom, { flex: 1 }]}>
            {isLoading ? (
                <ActivityIndicator size="large" color='rgba(1, 193, 219, 1)' style={localStyles.mediumTopPadding} /> 
            ) : (
                <View style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: codeHtml }}
                        style={sharedStyles.avoidingTabBarContainer}
                    />
                </View>
            )}
            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    );
}

export default EditorScreen;
