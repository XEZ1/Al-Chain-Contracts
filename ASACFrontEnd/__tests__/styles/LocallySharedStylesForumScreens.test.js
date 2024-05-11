import { StyleSheet } from 'react-native';
import getLocallySharedStylesForumScreens from '../../app/styles/LocallySharedStylesForumScreens';

describe('getLocallySharedStylesForumScreens', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getLocallySharedStylesForumScreens();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object));
    });

    it('should create styles correctly for light theme', () => {
        const styles = getLocallySharedStylesForumScreens('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            smallMargin: {
                marginBottom: 10,
            },
            mediumMargin: {
                marginBottom: '6%',
            },
            mediumTopMargin: {
                marginTop: '7%',
            },
            zeroPadding: {
                paddingTop: '0%',
                padding: '0%',
            },
            adjustedWidth: {
                width: '96%',
            },
            zeroTopMarginAndMediumBottomOne: {
                marginTop: '0%',
                marginBottom: '10%',
            },
            zeroBottomMarginAndLightRightOne: {
                marginRight: 10,
                marginBottom: '0%',
            },
            mediumBottomPadding: {
                paddingBottom: '10%'
            },
            mediumTopPadding: {
                paddingTop: '8%',
            },
            zeroBottomPadding: {
                paddingBottom: '0%',
            },
            zeroTopPadding: {
                paddingTop: '0%',
            },
            stretchedContainer: {
                alignItems: 'stretch',
            },
        });
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getLocallySharedStylesForumScreens('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            smallMargin: {
                marginBottom: 10,
            },
            mediumMargin: {
                marginBottom: '6%',
            },
            mediumTopMargin: {
                marginTop: '7%',
            },
            zeroPadding: {
                paddingTop: '0%',
                padding: '0%',
            },
            adjustedWidth: {
                width: '96%',
            },
            zeroTopMarginAndMediumBottomOne: {
                marginTop: '0%',
                marginBottom: '10%',
            },
            zeroBottomMarginAndLightRightOne: {
                marginRight: 10,
                marginBottom: '0%',
            },
            mediumBottomPadding: {
                paddingBottom: '10%'
            },
            mediumTopPadding: {
                paddingTop: '8%',
            },
            zeroBottomPadding: {
                paddingBottom: '0%',
            },
            zeroTopPadding: {
                paddingTop: '0%',
            },
            stretchedContainer: {
                alignItems: 'stretch',
            },
        });
    });
});
