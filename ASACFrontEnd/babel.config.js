module.exports = function (api, envSetting = process.env.BABEL_ENV) {
    api.cache(true);
    const isTest = envSetting === 'test';

    if (isTest) {
        return {
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
        };
    } else {
        return {
            presets: ['babel-preset-expo'],
            plugins: [
                ['module:react-native-dotenv']
            ]
        };
    }
};
