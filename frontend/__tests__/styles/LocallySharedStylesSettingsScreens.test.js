import { StyleSheet } from 'react-native';
import getLocallySharedStylesSettingsScreen from '../../app/styles/LocallySharedStylesSettingsScreens';


describe('getLocallySharedStylesSettingsScreen', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getLocallySharedStylesSettingsScreen();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object));
    });

    it('should create styles correctly for light theme', () => {
        const styles = getLocallySharedStylesSettingsScreen('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            maxWidthSmallMarginBottom: {
                width: '100%',
                marginBottom: '3%',
            },
        });
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getLocallySharedStylesSettingsScreen('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            maxWidthSmallMarginBottom: {
                width: '100%',
                marginBottom: '3%',
            },
        });
    });
});
