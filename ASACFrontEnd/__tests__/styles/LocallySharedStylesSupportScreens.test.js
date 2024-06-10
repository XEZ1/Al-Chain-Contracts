import { StyleSheet } from 'react-native';
import getLocallySharedStylesSupportScreens from '../../app/styles/LocallySharedStylesSupportScreens';


describe('getLocallySharedStylesSupportScreens', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getLocallySharedStylesSupportScreens();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object)); 
    });

    it('should create styles correctly for light theme', () => {
        const styles = getLocallySharedStylesSupportScreens('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            maxWidth: {
                width: '90%',
            },
            inputAreaContainer: {
                flexDirection: 'row', 
                alignItems: 'center', 
                margin: "5%",
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
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getLocallySharedStylesSupportScreens('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            maxWidth: {
                width: '90%',
            },
            inputAreaContainer: {
                flexDirection: 'row', 
                alignItems: 'center', 
                margin: "5%",
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
    });
});
