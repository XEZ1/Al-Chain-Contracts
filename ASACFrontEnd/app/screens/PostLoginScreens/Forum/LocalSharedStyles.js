import { StyleSheet } from 'react-native';

const getLocalStyles = (theme = 'light') => {
    const themeStyles = {
        light: {
            backgroundColor: 'rgba(1, 193, 219, 1)',
            textColor: 'rgb(57, 63, 67)',
            inputBackground: 'white',
            borderColor: 'rgba(0, 0, 0, 0.5)',
            containerBackground: 'white',
            cardBackground: 'white',
        },
        dark: {
            backgroundColor: 'rgba(1, 193, 219, 1)',
            textColor: 'rgb(255, 255, 255)',
            inputBackground: 'rgb(28, 28, 30)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            containerBackground: 'rgb(0, 0, 0)',
            containerBackground: '#1A1A1A',
            cardBackground: 'rgb(50, 50, 52)',
        },
    };

    return StyleSheet.create({
        boldMedium: {
            fontSize: 16, 
            fontWeight: 'bold',
        },
        bigMargin: {
            fontSize: 18, 
            marginBottom: 10, 
        },
        smallMargin: {
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
            paddingTop: 25,
        },

        
    });
};

export default getLocalStyles;
