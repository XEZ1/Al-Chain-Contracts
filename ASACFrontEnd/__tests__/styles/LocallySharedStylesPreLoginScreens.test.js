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
        });
    });
});
