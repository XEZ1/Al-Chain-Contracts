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
        containerCommentScreen: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '0%',
            padding: '5%',
            backgroundColor: themeStyles[theme].containerBackground, 
        },
        flatListCommentsContainer: {
            width: '100%',
            marginBottom: 90,
        },
        regularPadding: {
            paddingTop: 20,
            paddingBottom: 5,
        },
        settingText: {
            fontSize: 18,
            color: themeStyles[theme].textColor, 
        },
        postsContainer: {
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center', 
            justifyContent: 'space-between', 
        },
        postsButtonText: {
            flexDirection: 'row', 
            alignItems: 'center', 
            marginRight: 0,
        },
        buttonText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        centeredContainer: {
            flex: 1, 
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2%', 
        },
        inputCommentsScreen: {
            height: 44,
            width: '96%', 
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '5.5%',
            paddingLeft: '4%',
            color: themeStyles[theme].textColor, 
        },
        buttonCommentsScreen: {
            height: 44,
            width: '96%',
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: '5.7%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        settingText: {
            fontSize: 18,
            color: themeStyles[theme].textColor, 
        },
     
    });
};

export default getLocalStyles;
