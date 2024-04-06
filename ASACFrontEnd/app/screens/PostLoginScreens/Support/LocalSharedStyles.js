import { StyleSheet } from 'react-native';
import themeStyles from '../../../styles/ThemeStyles';

const getLocalStyles = (theme = 'light') => {
    return StyleSheet.create({
        maxWidth: {
            width: '100%',
        },
        inputAreaContainer: {
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingBottom: 85,
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
    });
};

export default getLocalStyles;
