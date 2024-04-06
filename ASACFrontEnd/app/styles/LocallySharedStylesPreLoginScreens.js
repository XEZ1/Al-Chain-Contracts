import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';

const getLocallySharedStylesPreLoginScreens = (theme = 'light') => {
    return StyleSheet.create({     
        mediumPadding: {
            padding: '8%',
        },
        boldAlignedText: {
            fontWeight: "bold", 
            textAlign: "center",
        },
        localButtonContainer: {
            height: 50, 
            width: 250, 
            marginBottom: '3%',
        },

    });
};

export default getLocallySharedStylesPreLoginScreens;
