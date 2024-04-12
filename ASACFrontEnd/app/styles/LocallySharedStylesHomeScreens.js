import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';

const getLocallySharedStylesHomeScreens = (theme = 'light') => {
    return StyleSheet.create({
        contractItemContainer: {
            marginBottom: 10,
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            borderColor: '#ddd',
        },
        smartContractButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: theme === 'dark' ? '#2D2D2D' : '#EFEFEF',
        },
        dropZone: {
            width: '100%',
            height: 150,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: themeStyles[theme].backgroundColor,
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5%',
        },
        inputFieldText: {
            color: theme === 'dark' ? 'grey' : 'darkgrey',
            fontSize: 16,
        },
        noContractsView: {
            textAlign: 'center',
            color: themeStyles[theme].textColor,
            fontSize: 16,
            paddingTop: 12.5,
            height: 50,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: themeStyles[theme].backgroundColor,
        },
        footer: {
            marginTop: 10,
            marginBottom: 10,
        },
        mediumTopPadding: {
            paddingTop: 10,
        },
        smallLeftMargin: {
            marginLeft: 5,
        },
        zeroMaringBottom: {
            marginBottom: 0,
        },
        backgroundContainer: {
            backgroundColor: themeStyles[theme].containerBackground,
        },
    });
};

export default getLocallySharedStylesHomeScreens;
