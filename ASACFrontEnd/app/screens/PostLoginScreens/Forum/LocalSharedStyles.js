import { StyleSheet } from 'react-native';
import themeStyles from '../../../styles/ThemeStyles';

const getLocalStyles = (theme = 'light') => {
    return StyleSheet.create({
        bigMargin: {
            fontSize: 18, 
            marginBottom: 10, 
        },
        mediumMargin: {
            marginTop: '7%',
        },
        zeroPadding: { 
            paddingTop: '0%', 
            padding: '0%' ,
        },
        adjustedWidthAndMargin: {
            width: '96%', 
            marginBottom: '6%',
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
    });
};

export default getLocalStyles;
