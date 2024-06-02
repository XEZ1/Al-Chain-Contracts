describe('Babel configuration', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    function loadConfig(envSetting) {
		const mockApi = { cache: () => {} }; 
        return require('../babel.config.js')(mockApi, envSetting);
    }

	it('should return the correct configuration for the default environment', () => {
        const config = require('../babel.config.js')({ cache: () => {} });
        expect(config).toEqual({
            presets: [
                'babel-preset-expo',
                '@babel/preset-typescript'
            ],
            plugins: [
                ['module:react-native-dotenv', {
                    "moduleName": "@env",
                    "path": ".env",
                }]
            ]
        });
    });

    it('should return the correct configuration for test environment', () => {
        const config = loadConfig('test');
        expect(config).toEqual({
            presets: [
                'babel-preset-expo',
                '@babel/preset-typescript'
            ],
            plugins: [
                ['module:react-native-dotenv', {
                    "moduleName": "@env",
                    "path": ".env",
                }]
            ]
        });
    });

    it('should return the correct configuration for non-test environment', () => {
		const config = loadConfig('production');
        expect(config).toEqual({
            presets: ['babel-preset-expo'],
            plugins: [
                ['module:react-native-dotenv']
            ]
        });
    });
});
