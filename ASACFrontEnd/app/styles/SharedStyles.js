import { StyleSheet } from 'react-native';

const getStyles = (theme = 'light') => {
    const themeStyles = {
        light: {
            backgroundColor: 'rgba(1, 193, 219, 1)', // Light blue for buttons
            textColor: 'rgb(57, 63, 67)', // Dark text color
            inputBackground: 'white', // White input background
            borderColor: 'rgba(0, 0, 0, 0.5)', // Border color
            containerBackground: 'white', // White background for containers
            cardBackground: 'white', // White background for cards
        },
        dark: {
            backgroundColor: 'rgba(1, 193, 219, 1)', // Maintain light blue for buttons
            textColor: 'rgb(255, 255, 255)', // White text
            inputBackground: 'rgb(28, 28, 30)', // Dark grey (almost black) for inputs
            borderColor: 'rgba(255, 255, 255, 0.5)', // White borders
            containerBackground: 'rgb(0, 0, 0)', // Black background for containers
            containerBackground: '#1A1A1A',
            cardBackground: 'rgb(50, 50, 52)', // Slightly lighter black for cards
        },
    };

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            //paddingTop: '16%',
            paddingTop: '5%',
            padding: '5%',
            backgroundColor: themeStyles[theme].containerBackground, // Set background color based on theme
            paddingBottom: '20%',
        },
        containerWithoutBackground: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backgroundImage: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabBar: {
            activeTintColor: theme === 'dark' ? 'white' : 'black', // Icons and labels in the active tab
            inactiveTintColor: theme === 'dark' ? 'grey' : 'darkgrey', // Icons and labels in the inactive tabs
            backgroundColor: 'rgba(1, 193, 219, 1)', // Light 
            //backgroundColor: theme === 'dark' ? 'black' : 'white', // Tab bar background
            borderColor: theme === 'dark' ? 'black' : 'white', // Border color or set to 'transparent' to hide
            position: 'absolute', // Position it absolutely
            bottom: '2.5%', // Align to the bottom of the screen
            left: '5%', // Spacing from the left
            right: '5%', // Spacing from the right
            borderRadius: '30%', // Rounded corners
            height: '7%', // Set a fixed height
            paddingVertical: '2%', //for the space between the icons and the labels
            paddingBottom: '2.5%', // for the padding of the labels
            borderTopWidth: '0%', // Remove the top border
            shadowColor: theme === 'dark' ? '#3A3A3A' : '#000', // Shadow for iOS
            shadowOffset: { width: '0%', height: '1%' },
            shadowOpacity: theme === 'dark' ? '0.8%' : '0.4%',
            shadowRadius: '20%',
        },
        tabBarLabel: {
            fontSize: 11,
        },
        input: {
            height: 44,
            width: '100%', // Make input stretch to full container width
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '5.5%',
            paddingLeft: '4%',
            color: themeStyles[theme].textColor, // Set text color based on theme for input text
        },
        inputPreLogin: {
            height: 50,
            width: '71%', // Make input stretch to full container width
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: '4.5%',
            paddingLeft: '4%',
            color: themeStyles[theme].textColor, // Set text color based on theme for input text
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
        buttonTextPreLogin: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
            fontWeight: 'bold',
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: '6%',
            color: themeStyles[theme].textColor, // Use theme color for text
            textAlign: 'center', // Center the title text
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '3%',
        },
        settingText: {
            fontSize: 18,
            color: themeStyles[theme].textColor, // Set text color based on theme
        },
        fileInput: {
            height: 44,
            width: '100%', // Changed to fill the container width
            backgroundColor: themeStyles[theme].inputBackground,
            marginBottom: 16,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: themeStyles[theme].borderColor,
        },
        fileInputText: {
            color: themeStyles[theme].textColor,
            fontSize: 16,
        },
        card: {
            width: '96%', // Cards should fill the width
            backgroundColor: themeStyles[theme].cardBackground, // Use theme background for card
            borderRadius: '10%',
            padding: '6%',
            marginBottom: '6%',
            shadowColor: theme === 'dark' ? '#3A3A3A' : '#000', // Adjust shadow color based on theme
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
        scrollView: {
            backgroundColor: themeStyles[theme].containerBackground, // Use theme background for scroll view
            marginBottom: 90,
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeStyles[theme].textColor, // Use theme color for header text
            marginBottom: 30,
        },
        footer: {
            marginTop: 20,
            marginBottom: 10,
        },
        footerText: {
            fontSize: 14,
            color: themeStyles[theme].textColor, // Use theme color for footer text
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
        dropZoneText: {
            textAlign: 'center',
            color: '#007bff',
            fontSize: 16,
        },
        sendButton: {
            backgroundColor: themeStyles[theme].backgroundColor,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: '5%',
            // Define a fixed width or use padding to determine the size of the button
            paddingVertical: 10, // Optional, adjust the vertical padding if needed
            height: 50,
        },
        fileInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
        },
        dropZoneText: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        contractText: {
            fontSize: 16,
            color: theme === 'dark' ? 'white' : 'black',
        },
        contractHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        expandedSection: {
            paddingTop: 10,
        },
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
        expandedSection: {
            marginTop: 10,
        },
        smartContractButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
            backgroundColor: theme === 'dark' ? '#2D2D2D' : '#EFEFEF', // Example background colors, adjust as needed
        },
        noContractsText: {
            textAlign: 'center',
            color: themeStyles[theme].textColor,
            marginTop: 20, // Add some margin to position it nicely in the card
            fontSize: 16, // Set the font size
        },
        EditorContainer: {
            flex: 1,
        },
        editor: {
            flex: 1,
            borderColor: themeStyles[theme].backgroundColor,
            backgroundColor: themeStyles[theme].inputBackground,
            color:  themeStyles[theme].textColor,
            padding: 10,
            textAlignVertical: 'top', // Align text to the top on Android
            marginBottom: 90,
        },

    });
};

export default getStyles;
