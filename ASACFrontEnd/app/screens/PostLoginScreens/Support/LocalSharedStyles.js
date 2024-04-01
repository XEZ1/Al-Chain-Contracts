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
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeStyles[theme].textColor, 
            marginBottom: 30,
        },
        settingText: {
            fontSize: 18,
            color: themeStyles[theme].textColor, 
        },
        input: {
            height: 44,
            width: '100%', 
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '5.5%',
            paddingLeft: '4%',
            color: themeStyles[theme].textColor, 
        },
        sendButton: {
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: '5%',        
            height: 50,
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
};

export default getLocalStyles;
