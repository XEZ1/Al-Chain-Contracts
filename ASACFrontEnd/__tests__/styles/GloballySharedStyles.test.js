import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import getGloballySharedStyles from '../../app/styles/GloballySharedStyles';


describe('getGloballySharedStyles', () => {
    beforeEach(() => {
        StyleSheet.create = jest.fn(styles => styles);
    });

    it('should create styles correctly when theme is not provided', () => {
        const styles = getGloballySharedStyles();
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual(expect.any(Object));
    });

    it('should create styles correctly for light theme', () => {
        const styles = getGloballySharedStyles('light');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            tabBar: { 
                activeTintColor: 'black', 
                inactiveTintColor: 'darkgrey', 
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderColor: 'white', 
                position: 'absolute', 
                bottom: '2.5%', 
                left: '5%', 
                right: '5%',
                height: '7%', 
                paddingVertical: '2%', 
                paddingBottom: '2.5%',
                borderRadius: 30,  
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.4%',
                shadowRadius: '8%',
                elevation: 1
            },
            container: { 
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '5%',
                padding: '5%',
                backgroundColor: 'white',
            },
            cardContainer: { 
                //padding: '8%',
                width: '96%', 
                backgroundColor: 'white',
                borderRadius: 10,
                padding: '6%',
                marginBottom: '8%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.4%',
                shadowRadius: '4%',
                elevation: 1,
                margin: '1%',
            },
            centeredViewContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            },
            modalViewContainer: {
                width: '80%', 
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 25,
                alignItems: "flex-start", 
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.4%',
                shadowRadius: '4%',
                elevation: 1
            },
            errorIconContainer: {
                position: 'absolute',
                right: 5,
                top: 5,
            },
            avoidingTabBarContainer: {
                marginBottom: 90,
            },
            rowCenteredContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            pageHeaderText: {
                fontSize: 28,
                fontWeight: 'bold',
                color: 'rgb(57, 63, 67)',
                marginBottom: 30,
            },
            cardHeaderText: {
                fontSize: 18,
                color: 'rgb(57, 63, 67)',
                fontWeight: 'bold',
                marginBottom: 10,
            },
            generalText: {
                color: 'rgb(57, 63, 67)',
            },
            button: {
                height: 44,
                width: '100%',
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                
            },
            exitButton: {
                position: 'absolute',
                top: 5,
                right: 5,
                justifyContent: 'center',
                alignItems: 'center',
            },
            errorText: {
                marginLeft: 5, 
                color: 'red', 
                fontSize: 14, 
            },
            modalText: {
                color: 'rgb(57, 63, 67)',
                marginBottom: 15,
                textAlign: "center"
            },
            errorListItem: {
                color: 'red',
                marginBottom: '5%',
            },
            textStyle: {
                color: 'rgb(57, 63, 67)',
                fontWeight: "bold",
                textAlign: "center"
            },
            exitButtonText: {
                color: 'white',
                fontWeight: 'bold',
            },
            inputField: {
                height: 44,
                width: '100%', 
                backgroundColor: 'white',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                color: 'rgb(57, 63, 67)',
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: '5.5%',
                paddingLeft: '4%',
            },
            separatorLine: {
                position: 'absolute',
                height: 0.3, 
                backgroundColor: 'darkgrey',
                bottom: 90,
                left: 0,
                right: 0,
            },
            activityIndicator: {
                paddingTop: '10%',
            },
    
            boldMediumText: {
                fontSize: 16, 
                fontWeight: 'bold',
            },
            bigFont: {
                fontSize: 18 
            },
            centeredText: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            mediumMarginBottom: {
                marginBottom: 90,
            },
        });
    });

    it('should create styles correctly for dark theme', () => {
        const styles = getGloballySharedStyles('dark');
        expect(StyleSheet.create).toHaveBeenCalled();
        expect(styles).toEqual({
            tabBar: {
                activeTintColor: 'white',
                inactiveTintColor: 'grey',
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderColor: 'black',
                position: 'absolute', 
                bottom: '2.5%', 
                left: '5%', 
                right: '5%',
                height: '7%', 
                paddingVertical: '2%', 
                paddingBottom: '2.5%',
                borderRadius: 30,  
                shadowColor: '#3A3A3A',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.8%',
                shadowRadius: '8%',
                elevation: 1
            },
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '5%',
                padding: '5%',
                backgroundColor: '#1A1A1A',
            },
            cardContainer: {
                //padding: '8%',
                width: '96%', 
                backgroundColor: 'rgb(50, 50, 52)',
                borderRadius: 10,
                padding: '6%',
                marginBottom: '8%',
                shadowColor: '#3A3A3A',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.8%',
                shadowRadius: '4%',
                elevation: 1,
                margin: '1%',
            },
            centeredViewContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            },
            modalViewContainer: {
                width: '80%', 
                margin: 20,
                backgroundColor: 'rgb(28, 28, 30)',
                borderRadius: 20,
                padding: 25,
                alignItems: "flex-start", 
                shadowColor: '#3A3A3A',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: '0.8%',
                shadowRadius: '4%',
                elevation: 1
            },
            errorIconContainer: {
                position: 'absolute',
                right: 5,
                top: 5,
            },
            avoidingTabBarContainer: {
                marginBottom: 90,
            },
            rowCenteredContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            pageHeaderText: {
                fontSize: 28,
                fontWeight: 'bold',
                color: 'rgb(255, 255, 255)',
                marginBottom: 30,
            },
            cardHeaderText: {
                fontSize: 18,
                color: 'rgb(255, 255, 255)',
                fontWeight: 'bold',
                marginBottom: 10,
            },
            generalText: {
                color: 'rgb(255, 255, 255)',
            },
            button: {
                height: 44,
                width: '100%',
                backgroundColor: 'rgba(1, 193, 219, 1)',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            },
            exitButton: {
                position: 'absolute',
                top: 5,
                right: 5,
                justifyContent: 'center',
                alignItems: 'center',
            },
            errorText: {
                marginLeft: 5, 
                color: 'red', 
                fontSize: 14, 
            },
            modalText: {
                color: 'rgb(255, 255, 255)',
                marginBottom: 15,
                textAlign: "center"
            },
            errorListItem: {
                color: 'red',
                marginBottom: '5%',
            },
            textStyle: {
                color: 'rgb(255, 255, 255)',
                fontWeight: "bold",
                textAlign: "center"
            },
            exitButtonText: {
                color: 'white',
                fontWeight: 'bold',
            },
            inputField: {
                height: 44,
                width: '100%', 
                backgroundColor: 'rgb(28, 28, 30)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'rgb(255, 255, 255)',
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: '5.5%',
                paddingLeft: '4%',
            },
            separatorLine: {
                position: 'absolute',
                height: 0.3, 
                backgroundColor: 'grey',
                bottom: 90,
                left: 0,
                right: 0,
            },
            activityIndicator: {
                paddingTop: '10%',
            },
            boldMediumText: {
                fontSize: 16, 
                fontWeight: 'bold',
            },
            bigFont: {
                fontSize: 18 
            },
            centeredText: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            mediumMarginBottom: {
                marginBottom: 90,
            },
        });
    });
});

describe('Platform-specific Styles', () => {
    describe('iOS specific styles', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
                OS: 'ios',
                select: jest.fn(spec => spec.ios),
            }));
        });

        it('should adjust styles based on iOS platform', () => {
            const styles = getGloballySharedStyles('light');
            expect(styles.tabBar.bottom).toEqual('2.5%');
            expect(styles.avoidingTabBarContainer.marginBottom).toEqual(90);
        });
    });

    describe('Android specific styles', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
                OS: 'android',
                select: jest.fn(spec => spec.android),
            }));
        });

        it('should adjust styles based on Android platform', () => {
            const styles = getGloballySharedStyles('light');
            expect(styles.tabBar.bottom).toEqual(0);
            expect(styles.avoidingTabBarContainer.marginBottom).toEqual(0);
        });
    });
});
