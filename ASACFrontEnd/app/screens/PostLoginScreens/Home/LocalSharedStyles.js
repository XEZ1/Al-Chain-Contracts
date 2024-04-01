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
        contractItem: {
            marginBottom: 10,
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            borderColor: '#ddd',
        },
        contractItemHeader: {
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
        smartContractButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: theme === 'dark' ? '#2D2D2D' : '#EFEFEF',
        },

        bottomTabNavigatorContainer: {
            flex: 1, 
            backgroundColor: themeStyles[theme].containerBackground,
            
        },
        editorContainer: {
            backgroundColor: themeStyles[theme].inputBackground,
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
       
        inputFieldText: {
            color: theme === 'dark' ? 'grey' : 'darkgrey',
            fontSize: 16,
        },
        inputField: {
            height: 44,
            width: '100%', 
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            color: themeStyles[theme].textColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '5.5%',
            paddingLeft: '4%',
        },
        button: {
            height: 44,
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
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
        
    });
};

export default getLocalStyles;
