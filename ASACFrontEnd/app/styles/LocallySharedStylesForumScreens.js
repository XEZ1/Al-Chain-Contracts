import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';

const getLocallySharedStylesForumScreens = (theme = 'light') => {
    return StyleSheet.create({
        smallMargin: {
            marginBottom: 10, 
        },
        mediumMargin: {
            marginBottom: '6%',
        },
        mediumTopMargin: {
            marginTop: '7%',
        },
        zeroPadding: { 
            paddingTop: '0%', 
            padding: '0%' ,
        },
        adjustedWidth: {
            width: '96%', 
        },
        zeroTopMarginAndMediumBottomOne: {
            marginTop: '0%', 
            marginBottom: '10%',
        },
        zeroBottomMarginAndLightRightOne: {
            marginRight: 10, 
            marginBottom: '0%',
        },
        mediumBottomPadding: {
            paddingBottom: '10%' 
        },
        mediumTopPadding: {
            paddingTop: '8%',
        },
        zeroBottomPadding: {
            paddingBottom: '0%',
        },
        zeroTopPadding: {
            paddingTop: '0%',
        },
        stretchedContainer: {
            alignItems: 'stretch',
        },
    });
};

export default getLocallySharedStylesForumScreens;
