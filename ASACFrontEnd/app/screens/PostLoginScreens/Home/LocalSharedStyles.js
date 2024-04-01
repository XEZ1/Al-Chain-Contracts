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

        baseContainer: {
            flex: 1, 
            backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white', 
        },
        activityIndicator: {
            paddingTop: '10%',
        },
        EditorContainer: {
            flex: 1,
        },

        scrollView: {
            backgroundColor: themeStyles[theme].containerBackground, 
            marginBottom: 90,
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
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        dropZoneText: {
            textAlign: 'center',
            color: '#007bff',
            fontSize: 16,
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
        button: {
            height: 44,
            width: '100%',
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: '5.7%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        noContractsText: {
            textAlign: 'center',
            color: themeStyles[theme].textColor,
            marginTop: 20, 
            fontSize: 16,
        },
        footer: {
            marginTop: 10,
            marginBottom: 10,
        },
        footerText: {
            fontSize: 14,
            color: themeStyles[theme].textColor,
        },
    });
};

export default getLocalStyles;
