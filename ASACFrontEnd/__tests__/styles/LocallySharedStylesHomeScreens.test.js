import { StyleSheet } from 'react-native';
import getLocallySharedStylesHomeScreens from '../../app/styles/LocallySharedStylesHomeScreens';

describe('getLocallySharedStylesHomeScreens', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getLocallySharedStylesHomeScreens();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object));
    });

    it('should create styles correctly for light theme', () => {
        const styles = getLocallySharedStylesHomeScreens('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            contractItemContainer: {
                marginBottom: 10,
                paddingHorizontal: 10,
                paddingTop: 10,
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderRadius: 10,
                borderColor: '#ddd',
            },
            smartContractButton: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                backgroundColor: '#EFEFEF',
            },
            dropZone: {
                width: '100%',
                height: 150,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'rgba(1, 193, 219, 1)',
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '5%',
            },
            inputFieldText: {
                color: 'darkgrey',
                fontSize: 16,
            },
            noContractsView: {
                textAlign: 'center',
                color: 'rgb(57, 63, 67)',
                fontSize: 16,
                paddingTop: 12.5,
                height: 50,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'rgba(1, 193, 219, 1)',
            },
            footer: {
                marginTop: 10,
                marginBottom: 10,
            },
            mediumTopPadding: {
                paddingTop: 10,
            },
            smallLeftMargin: {
                marginLeft: 5,
            },
            zeroMaringBottom: {
                marginBottom: 0,
            },
            backgroundContainer: {
                backgroundColor: 'white',
            },
        });
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getLocallySharedStylesHomeScreens('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            contractItemContainer: {
                marginBottom: 10,
                paddingHorizontal: 10,
                paddingTop: 10,
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderRadius: 10,
                borderColor: '#ddd',
            },
            smartContractButton: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                backgroundColor: '#2D2D2D',
            },
            dropZone: {
                width: '100%',
                height: 150,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'rgba(1, 193, 219, 1)',
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '5%',
            },
            inputFieldText: {
                color: 'grey',
                fontSize: 16,
            },
            noContractsView: {
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                fontSize: 16,
                paddingTop: 12.5,
                height: 50,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'rgba(1, 193, 219, 1)',
            },
            footer: {
                marginTop: 10,
                marginBottom: 10,
            },
            mediumTopPadding: {
                paddingTop: 10,
            },
            smallLeftMargin: {
                marginLeft: 5,
            },
            zeroMaringBottom: {
                marginBottom: 0,
            },
            backgroundContainer: {
                backgroundColor: '#1A1A1A',
            },
        });
    });
});
