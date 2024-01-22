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
            cardBackground: 'rgb(50, 50, 52)', // Slightly lighter black for cards
        },
    };

    return StyleSheet.create({
        tabBar: {
            activeTintColor: theme === 'dark' ? 'white' : 'black', // Icons and labels in the active tab
            inactiveTintColor: theme === 'dark' ? 'grey' : 'darkgrey', // Icons and labels in the inactive tabs
            backgroundColor: 'rgba(1, 193, 219, 1)', // Light 
            //backgroundColor: theme === 'dark' ? 'black' : 'white', // Tab bar background
            borderColor: theme === 'dark' ? 'black' : 'white', // Border color or set to 'transparent' to hide
            position: 'absolute', // Position it absolutely
            bottom: 20, // Align to the bottom of the screen
            left: 20, // Spacing from the left
            right: 20, // Spacing from the right
            borderRadius: 30, // Rounded corners
            height: 60, // Set a fixed height
            paddingVertical: 10, //for the space between the icons and the labels
            paddingBottom: 12, // for the padding of the labels
            borderTopWidth: 0, // Remove the top border
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
        },
        tabBarLabel: {
            fontSize: 11,
        },
        backgroundImage: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            padding: 20,
            backgroundColor: themeStyles[theme].containerBackground, // Set background color based on theme
            paddingBottom: 80,
        },
        containerWithoutBackground: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            height: 44,
            width: '100%', // Make input stretch to full container width
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 16,
            paddingLeft: 12,
            color: themeStyles[theme].textColor, // Set text color based on theme for input text
        },
        inputPreLogin: {
            height: 50,
            width: '71%', // Make input stretch to full container width
            backgroundColor: themeStyles[theme].inputBackground,
            borderColor: themeStyles[theme].borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 16,
            paddingLeft: 13,
            color: themeStyles[theme].textColor, // Set text color based on theme for input text
        },
        button: {
            height: 44,
            width: '100%',
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: 16,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonPreLogin: {
            height: 50,
            width: 250,
            backgroundColor: themeStyles[theme].backgroundColor,
            marginBottom: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 1,
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
            marginBottom: 20,
            color: themeStyles[theme].textColor, // Use theme color for text
            textAlign: 'center', // Center the title text
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
            width: '100%', // Cards should fill the width
            backgroundColor: themeStyles[theme].cardBackground, // Use theme background for card
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
            shadowColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#000', // Adjust shadow color based on theme
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        cardHeader: {
            fontSize: 18,
            color: themeStyles[theme].textColor,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        scrollView: {
            backgroundColor: themeStyles[theme].containerBackground, // Use theme background for scroll view
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
            marginBottom: 20,
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
            paddingHorizontal: 20,
            // Define a fixed width or use padding to determine the size of the button
            paddingVertical: 10, // Optional, adjust the vertical padding if needed
        },
        
    });
};

export default getStyles;
