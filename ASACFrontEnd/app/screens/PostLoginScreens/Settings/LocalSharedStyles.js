import { StyleSheet } from 'react-native';
import themeStyles from '../../../styles/ThemeStyles';

const getLocalStyles = (theme = 'light') => {
    return StyleSheet.create({
        maxWidthSmallMarginBottom: {
            width: '100%', marginBottom: '3%',
        },
    });
};

export default getLocalStyles;
