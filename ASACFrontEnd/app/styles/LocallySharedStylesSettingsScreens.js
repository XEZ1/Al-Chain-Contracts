import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';

const getLocalSharedStylesSettingsScreens = (theme = 'light') => {
    return StyleSheet.create({
        maxWidthSmallMarginBottom: {
            width: '100%', marginBottom: '3%',
        },
    });
};

export default getLocalSharedStylesSettingsScreens;
