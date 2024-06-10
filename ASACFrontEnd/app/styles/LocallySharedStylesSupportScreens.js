import { StyleSheet } from 'react-native';
import themeStyles from './ThemeStyles';

const getLocallySharedStylesSupportScreens = (theme = 'light') => {
    return StyleSheet.create({
        maxWidth: {
            width: '90%',
            //padding: '5%'
        },
        inputAreaContainer: {
            flexDirection: 'row', 
            alignItems: 'center', 
            margin: '5%'
        },
        inputFieldLocalContainer: {
            flex: 1,
            marginRight: 10,
            marginTop: 18.5,
            height: 50, 
        },
        localButtonContainer: {
            width: 'auto', 
            height: 50, 
            paddingHorizontal: '5%'
        },
        smallPadding: {
            paddingBottom: 90,
            marginBottom: 90,
        },
        zeroPadding: {
            paddingBottom: '0%',
            padding: '0%'
        },

    });
};

export default getLocallySharedStylesSupportScreens;
