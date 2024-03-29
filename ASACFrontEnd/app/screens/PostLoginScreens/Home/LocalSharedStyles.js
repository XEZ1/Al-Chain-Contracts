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
        contractItemAnimation: {
            marginBottom: 10,
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            borderColor: '#ddd',
        },
        contractHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        generalText: {
            color: theme === 'dark' ? 'white' : 'black', 
        },
        expandedSection: {
            paddingTop: 10,
        },
        contractItemText: {
            color: theme === 'dark' ? 'white' : 'black', 
            marginLeft: 5,
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

        
    });
};

export default getLocalStyles;
