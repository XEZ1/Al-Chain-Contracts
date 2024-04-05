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
        maxWidth: {
            width: '100%',
        },
        smallPading: {
            padding: 10, 
        },
        bigFont: {
            fontSize: 18 
        },
        inputAreaContainer: {
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingBottom: 85,
        },
        inputFieldLocalContainer: {
            flex: 1,
            marginRight: 10,
            marginTop: 18.5,
            height: 50, 
        },
        localButtonContainer: {
            width: 'auto', 
            height: 50, 
            paddingHorizontal: '5%'
        },
        boldMedium: {
            fontSize: 16, 
            fontWeight: 'bold',
        },
    });
};

export default getLocalStyles;
