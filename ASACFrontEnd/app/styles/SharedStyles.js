import { StyleSheet } from 'react-native';

const getStyles = (theme = 'light') => {
    const themeStyles = {
        light: {
            backgroundColor: 'rgba(1, 193, 219, 0.8)',
            textColor: 'rgb(57, 63, 67)',
            inputBackground: 'white',
            borderColor: 'rgba(0, 0, 0, 0.5)',
        },
        dark: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            textColor: 'rgb(255, 255, 255)',
            inputBackground: 'grey',
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
    };

    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        input: {
            height: 44,
            width: 250,
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 16,
            paddingLeft: 12,
        },
        button: {
            height: 44,
            width: 250,
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: 16,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
        },
        settingText: {
            fontSize: 18,
        }
    });
};

export default getStyles;
