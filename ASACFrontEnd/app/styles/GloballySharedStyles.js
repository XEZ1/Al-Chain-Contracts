import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';
import { Platform } from 'react-native';

const getGloballySharedStyles = (theme = 'light') => {
    return StyleSheet.create({
        tabBar: { //tab bar styling
            activeTintColor: theme === 'dark' ? 'white' : 'black', 
            inactiveTintColor: theme === 'dark' ? 'grey' : 'darkgrey', 
            backgroundColor: themeStyles[theme].backgroundColor,  
            borderColor: theme === 'dark' ? 'black' : 'white', 
            position: 'absolute', 
            bottom: Platform.OS === 'android' ? 0 : '2.5%',
            left: '5%', 
            right: '5%',
            height: '7%', 
            paddingVertical: '2%', 
            paddingBottom: '2.5%',
            borderRadius: 30,  
            shadowColor: themeStyles[theme].shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: themeStyles[theme].shadowOpacity,
            shadowRadius: '8%',
            elevation: 1
        },

        container: { // general container
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '5%',
            padding: '5%',
            backgroundColor: themeStyles[theme].containerBackground,
        },
        cardContainer: { // used for cards
            //padding: '8%',
            width: '96%', 
            backgroundColor: themeStyles[theme].cardBackground,
            borderRadius: 10,
            padding: '6%',
            marginBottom: '8%',
            shadowColor: themeStyles[theme].shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: themeStyles[theme].shadowOpacity,
            shadowRadius: '4%',
            elevation: 1,
            margin: '1%',
        },
        centeredViewContainer: { // used for modals
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modalViewContainer: { // used for modals
            width: '80%', 
            margin: 20,
            backgroundColor: themeStyles[theme].inputBackground,
            borderRadius: 20,
            padding: 25,
            alignItems: "flex-start", 
            shadowColor: themeStyles[theme].shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: themeStyles[theme].shadowOpacity,
            shadowRadius: '4%',
            elevation: 1
        },
        errorIconContainer: {
            position: 'absolute',
            right: 5,
            top: 5,
        },
        avoidingTabBarContainer: {
            marginBottom: Platform.OS === 'android' ? 0 : 90,
        },
        rowCenteredContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        scrollViewContentContainer: {
            flexGrow: 1,
            justifyContent: 'center', 
            
        },

        pageHeaderText: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeStyles[theme].textColor,
            marginBottom: 30,
        },
        cardHeaderText: {
            fontSize: 18,
            color: themeStyles[theme].textColor,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        generalText: {
            color: themeStyles[theme].textColor, 
        },
        
        button: {
            height: 44,
            width: '100%',
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            
        },
        exitButton: {
            position: 'absolute',
            top: 5,
            right: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },

        // ADJUST AND DELETE: Modals
        errorText: {
            marginLeft: 5, 
            color: 'red', 
            fontSize: 14, 
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
        exitButtonText: {
            color: 'white',
            fontWeight: 'bold',
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

        boldMediumText: {
            fontSize: 16, 
            fontWeight: 'bold',
        },
        bigFont: {
            fontSize: 18 
        },

        centeredText: {
            justifyContent: 'center',
            alignItems: 'center',
        },

        mediumMarginBottom: {
            marginBottom: 90,
        },
    });
};

export default getGloballySharedStyles;
