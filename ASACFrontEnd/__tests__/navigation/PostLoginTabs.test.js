import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../app/components/Theme';
import PostLoginTabs from '../../app/navigation/PostLoginTabs';


jest.mock('@react-navigation/bottom-tabs', () => {
    const actualNav = jest.requireActual('@react-navigation/bottom-tabs');
    return {
        createBottomTabNavigator: () => actualNav.createBottomTabNavigator(),
    };
});

jest.mock('@react-navigation/stack', () => {
    const actualStack = jest.requireActual('@react-navigation/stack');
    return {
        createStackNavigator: () => actualStack.createStackNavigator(),
    };
});

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
    };
});

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        ViewPagerAndroid: View,
        DrawerLayout: View,
        WebView: View,
        SafeAreaView: View,
        FlatList: View,
        SectionList: View,
        GestureHandlerRootView: View,
        PanGestureHandler: View,
        Directions: {},
    };
});

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve('mocked-token')),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: 'Test Post', description: 'This is a test post', like_count: 5 }]),
    })
);

jest.mock('../../app/screens/PostLoginScreens/Forum/UseForumScreen', () => ({
    useForumScreen: jest.fn(),
    PostProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../app/screens/PostLoginScreens/Forum/CommentScreen', () => (props) => <div {...props}>CommentScreen</div>);

jest.mock('../../app/screens/PostLoginScreens/Support/SupportScreen', () => (props) => <div {...props}>SupportScreen</div>);

jest.mock('../../app/screens/PostLoginScreens/Settings/SettingsScreen', () => (props) => <div {...props}>SettingsScreen</div>);

jest.mock('../../app/screens/PostLoginScreens/Forum/ForumScreen', () => (props) => <div {...props}>ForumScreen</div>);

jest.mock('../../app/screens/PostLoginScreens/Home/EditorScreen', () => (props) => <div {...props}>EditorScreen</div>);

jest.mock('../../app/screens/PostLoginScreens/Home/HomeScreen', () => (props) => <div {...props}>HomeScreen</div>);


describe('PostLoginTabs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(cleanup);

    const renderPostLoginTabs = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <NavigationContainer>
                    <PostLoginTabs />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderPostLoginTabs();

        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Forum')).toBeTruthy();
        expect(getByText('Support')).toBeTruthy();
        expect(getByText('Settings')).toBeTruthy();
    });

    it('renders home stack correctly', () => {
        const { findByTestId, getByText, queryByText, debug } = renderPostLoginTabs();

        fireEvent.press(getByText('Home'));
        expect(getByText('Home')).toBeTruthy();
    });

    it('renders forum stack correctly', () => {
        const { findByTestId, getByText, queryByText } = renderPostLoginTabs();
        
        fireEvent.press(getByText('Forum'));
        expect(getByText('Forum')).toBeTruthy();
    });

    it('renders each tab and checks correct icon', async () => {
        const { getByText, findByTestId, findAllByTestId } = renderPostLoginTabs();
    
        fireEvent.press(getByText('Home'));
        const iconsHome = await findAllByTestId('home-icon-test-ID');
        expect(iconsHome).toHaveLength(2);
    
        fireEvent.press(getByText('Forum'));
        const iconsForum = await findAllByTestId('forum-icon-test-ID');
        expect(iconsForum).toHaveLength(2);
    
        fireEvent.press(getByText('Support'));
        const iconsSupport = await findAllByTestId('support-icon-test-ID');
        expect(iconsSupport).toHaveLength(2);
    
        fireEvent.press(getByText('Settings'));
        const iconsSettings = await findAllByTestId('settings-icon-test-ID');
        expect(iconsSettings).toHaveLength(2);
    });

    it('renders correctly with light theme', () => {
        const { getByTestId } = renderPostLoginTabs('light');

        const safeAreaView = getByTestId('safeAreaViewTestID');
        const safeAreaViewColour = safeAreaView.props.style.backgroundColor;
        expect(safeAreaViewColour).toEqual('white');

        const topSeparatorLine = getByTestId('topSeparatorLineTestID');
        const topSeparatorLineColour = topSeparatorLine.props.style.backgroundColor;
        expect(topSeparatorLineColour).toEqual('darkgrey');
    });

    it('renders correctly with dark theme', () => {
        const { getByTestId } = renderPostLoginTabs('dark');

        const safeAreaView = getByTestId('safeAreaViewTestID');
        const safeAreaViewColour = safeAreaView.props.style.backgroundColor;
        expect(safeAreaViewColour).toEqual('rgb(28, 28, 30)');

        const topSeparatorLine = getByTestId('topSeparatorLineTestID');
        const topSeparatorLineColour = topSeparatorLine.props.style.backgroundColor;
        expect(topSeparatorLineColour).toEqual('grey');
    });
});
