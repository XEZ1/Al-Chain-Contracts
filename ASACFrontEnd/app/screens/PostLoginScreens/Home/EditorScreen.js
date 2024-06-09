import { View, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { WebView } from 'react-native-webview';
import { useEditorScreen } from './UseEditorScreen';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesHomeScreens from '../../../styles/LocallySharedStylesHomeScreens';


function EditorScreen({ route, navigation }) {  
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesHomeScreens(theme); 

    const { filePath } = route.params;
    const { codeHtml, isLoading } = useEditorScreen(filePath, theme);

    return (
        <View style={[localStyles.backgroundContainer, { flex: 1 }]}>
            {isLoading ? (
                <ActivityIndicator size="large" color='rgba(1, 193, 219, 1)' style={localStyles.mediumTopPadding} testID='activityIndicatorTestID'/> 
            ) : (
                <View style={[localStyles.backgroundContainer, { flex: 1 }]}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: codeHtml }}
                        style={[sharedStyles.avoidingTabBarContainer, localStyles.backgroundContainer]}
                        testID='webViewTestID'
                    />
                </View>
            )}
            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    );
}

export default EditorScreen;
