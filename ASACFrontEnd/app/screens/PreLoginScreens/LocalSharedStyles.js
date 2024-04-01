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
        errorIconContainerSignUp: {
            position: 'absolute',
            right: 20,
            top: 70,
        },
        inputPreLogin: {
            height: 50,
            width: '71%', 
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '4.5%',
            paddingLeft: '4%',
            color: themeStyles[theme].textColor, 
        },
        buttonPreLogin: {
            height: 50,
            width: 250,
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: '3%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '0.5%',
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        textStyle: {
            color: themeStyles[theme].textColor,
            fontWeight: "bold",
            textAlign: "center"
        },

        containerWithoutBackground: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonTextPreLogin: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        backgroundImage: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

export default getLocalStyles;
