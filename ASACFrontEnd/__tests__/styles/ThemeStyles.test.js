import themeStyles from "../../app/styles/ThemeStyles";

describe('Theme Styles Configuration', () => {
    it('should have specific keys for both themes', () => {
        const expectedKeys = [
            'backgroundColor', 'textColor', 'inputBackground', 'borderColor',
            'containerBackground', 'cardBackground', 'shadowColor', 'shadowOpacity'
        ];

        expectedKeys.forEach(key => {
            expect(themeStyles.light).toHaveProperty(key);
            expect(themeStyles.dark).toHaveProperty(key);
        });
    });

    it('should match exact values for light theme', () => {
        const expectedLightTheme = {
            backgroundColor: 'rgba(1, 193, 219, 1)',
            textColor: 'rgb(57, 63, 67)',
            inputBackground: 'white',
            borderColor: 'rgba(0, 0, 0, 0.5)',
            containerBackground: 'white',
            cardBackground: 'white',
            shadowColor: '#000',
            shadowOpacity: '0.4%',
        };

        expect(themeStyles.light).toEqual(expectedLightTheme);
    });

    it('should match exact values for dark theme', () => {
        const expectedDarkTheme = {
            backgroundColor: 'rgba(1, 193, 219, 1)',
            textColor: 'rgb(255, 255, 255)',
            inputBackground: 'rgb(28, 28, 30)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            containerBackground: '#1A1A1A',
            cardBackground: 'rgb(50, 50, 52)',
            shadowColor: '#3A3A3A',
            shadowOpacity: '0.8%',
        };

        expect(themeStyles.dark).toEqual(expectedDarkTheme);
    });
});
