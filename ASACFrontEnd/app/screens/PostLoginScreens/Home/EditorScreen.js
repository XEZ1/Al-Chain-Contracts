import { View, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { WebView } from 'react-native-webview';
import { useEditorScreen } from './UseEditorScreen';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesHomeScreens from '../../../styles/LocallySharedStylesHomeScreens';


/**
 * EditorScreen component for displaying a web view with code editor.
 * @param {object} props - The props object for the component.
 * @param {object} props.route - The route object containing navigation parameters.
 * @param {object} props.navigation - The navigation object for navigating between screens.
 * @returns {JSX.Element} The EditorScreen component.
 */
function EditorScreen({ route, navigation }) {  
    // Extract theme from ThemeContext
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesHomeScreens(theme); 

    // Extract filePath from the route parameters
    const { filePath } = route.params;
    // Custom hook to fetch and manage the code HTML and loading state
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
                        style={[sharedStyles.mediumMarginBottom, localStyles.backgroundContainer]}
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
