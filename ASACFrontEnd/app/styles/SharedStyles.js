import { StyleSheet } from 'react-native';

const getStyles = (theme = 'light') => {
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
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '5%',
            padding: '5%',
            backgroundColor: themeStyles[theme].containerBackground,
        },
        tabBar: {
            activeTintColor: theme === 'dark' ? 'white' : 'black', 
            inactiveTintColor: theme === 'dark' ? 'grey' : 'darkgrey', 
            backgroundColor: 'rgba(1, 193, 219, 1)',  
            borderColor: theme === 'dark' ? 'black' : 'white', 
            position: 'absolute', 
            bottom: '2.5%', 
            left: '5%', 
            right: '5%',
            borderRadius: '30%', 
            height: '7%', 
            paddingVertical: '2%', 
            paddingBottom: '2.5%',
            borderTopWidth: '0%', 
            shadowColor: theme === 'dark' ? '#3A3A3A' : '#000',
            shadowOffset: { width: '0%', height: '1%' },
            shadowOpacity: theme === 'dark' ? '0.8%' : '0.4%',
            shadowRadius: '20%',
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: '6%',
            color: themeStyles[theme].textColor, 
            textAlign: 'center', 
        },
        card: {
            width: '96%', 
            backgroundColor: themeStyles[theme].cardBackground,
            borderRadius: '10%',
            padding: '6%',
            marginBottom: '6%',
            shadowColor: theme === 'dark' ? '#3A3A3A' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === 'dark' ? '0.8%' : '0.4%',
            shadowRadius: '4%',
            elevation: '1%',
            margin: '1%',
            marginTop: '2%',
            marginLeft: '2%',
            marginLeft: '2%'
        },
        cardHeader: {
            fontSize: 18,
            color: themeStyles[theme].textColor,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeStyles[theme].textColor,
            marginBottom: 30,
        },
        
        // Modals
        errorIcon: {
            color: 'red', 
        },
        errorText: {
            marginLeft: 5, 
            color: 'red', 
            fontSize: 14, 
        },
        errorIconContainer: {
            position: 'absolute',
            right: 5,
            top: 5,
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modalView: {
            width: '80%', 
            margin: 20,
            backgroundColor: themeStyles[theme].inputBackground,
            borderRadius: 20,
            padding: 25,
            alignItems: "flex-start", 
            shadowColor: "#000",
            shadowOffset: {
                width: 2,
                height: 3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        modalText: {
            color: themeStyles[theme].textColor,
            marginBottom: 15,
            textAlign: "center"
        },
        errorListItem: {
            color: 'red',
            marginBottom: '5%',
        },
        textStyle: {
            color: themeStyles[theme].textColor,
            fontWeight: "bold",
            textAlign: "center"
        },
        exitButton: {
            position: 'absolute',
            top: 5,
            right: 5,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme === 'dark' ? '#3A3A3A' : '#000',
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.15,
            shadowRadius: 3.84, 
            elevation: 5,
        },
        exitButtonText: {
            color: 'white',
            fontWeight: 'bold',
        },

        separatorLine: {
            position: 'absolute',
            height: 0.3, 
            backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey',
            bottom: 90,
            left: 0,
            right: 0,
        },
        
        activityIndicator: {
            paddingTop: '10%',
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
    });
};

export default getStyles;
