import { StyleSheet } from 'react-native';
import getLocallySharedStylesPreLoginScreens from '../../app/styles/LocallySharedStylesPreLoginScreens';


describe('getLocallySharedStylesPreLoginScreens', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getLocallySharedStylesPreLoginScreens();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object));
    });

    it('should create styles correctly for light theme', () => {
        const styles = getLocallySharedStylesPreLoginScreens('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            mediumPadding: {
                padding: '8%',
            },
            boldAlignedText: {
                fontWeight: "bold",
                textAlign: "center",
            },
            localButtonContainer: {
                height: 50,
                width: 250,
                marginBottom: '3%',
            },
            container: {
                width: '100%',
                marginBottom: 90,
                paddingTop: '85%',
                padding: '5%',
                backgroundColor: 'white',
            },
            scroll: {
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5%',
                paddingTop: 350,
            },
            backgroundContainer: {
                backgroundColor: 'white',
            },
            topSeparatorLine: {
                top: 90,
                zIndex: 1,
            },
            bigTopMargin: {
                marginTop: 40,
            },
            mediumTopPadding: {
                paddingTop: '40%',
                //paddingTop: '25%',
            },
            bigTopPadding: {
                paddingTop: '70%',
            },
            fullWidth: {
                width: '100%',
            },
            zeroMargin: {
                margin: 0,
            },
            containerWithPadding: {
                padding: 20,
                backgroundColor: 'white'
            },
            logo: {
                width: 150,
                height: 150,
                alignSelf: 'center',
                marginBottom: 20,
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20,
                color: 'rgb(57, 63, 67)',
            },
            sectionTitle: {
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
                color: 'rgb(57, 63, 67)',
            },
            text: {
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 10,
                color: 'rgb(57, 63, 67)',
            },
        });
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getLocallySharedStylesPreLoginScreens('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            mediumPadding: {
                padding: '8%',
            },
            boldAlignedText: {
                fontWeight: "bold",
                textAlign: "center",
            },
            localButtonContainer: {
                height: 50,
                width: 250,
                marginBottom: '3%',
            },
            container: {
                width: '100%',
                marginBottom: 90,
                paddingTop: '85%',
                padding: '5%',
                backgroundColor: '#1A1A1A',
            },
            scroll: {
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5%',
                paddingTop: 350,
            },
            backgroundContainer: {
                backgroundColor: '#1A1A1A',
            },
            topSeparatorLine: {
                top: 90,
                zIndex: 1,
            },
            bigTopMargin: {
                marginTop: 40,
            },
            mediumTopPadding: {
                paddingTop: '40%',
                //paddingTop: '25%',
            },
            bigTopPadding: {
                paddingTop: '70%',
            },
            fullWidth: {
                width: '100%',
            },
            zeroMargin: {
                margin: 0,
            },
            containerWithPadding: {
                padding: 20,
                backgroundColor: 'rgb(28, 28, 30)'
            },
            logo: {
                width: 150,
                height: 150,
                alignSelf: 'center',
                marginBottom: 20,
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20,
                color: 'rgb(255, 255, 255)',
            },
            sectionTitle: {
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
                color: 'rgb(255, 255, 255)',
            },
            text: {
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 10,
                color: 'rgb(255, 255, 255)',
            },
        });
    });
});
