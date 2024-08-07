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
        container: {
            width: '100%',
            marginBottom: 90,
            paddingTop: '85%',
            padding: '5%',
            backgroundColor: themeStyles[theme].containerBackground,
        },
        scroll: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5%',
            paddingTop: 350,
        },
        backgroundContainer: {
            backgroundColor: themeStyles[theme].containerBackground,
        },
        topSeparatorLine: {
            top: 90, 
            zIndex: 1,
        },
        bigTopMargin: {
            marginTop: 40,
        },
        mediumTopPadding: {
            paddingTop: '40%',
            //paddingTop: '25%',
        },
        bigTopPadding: {
            paddingTop: '70%',
        },
        fullWidth: {
            width: '100%',
        },
        zeroMargin: {
            margin: 0,
        },
    });
};

export default getLocallySharedStylesPreLoginScreens;
