import React from 'react';
import { render } from '@testing-library/react-native';
import EditorScreen from '../../../../app/screens/PostLoginScreens/Home/EditorScreen';
import { WebView } from 'react-native-webview';
import { ThemeContext } from '../../../../app/components/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { getByTestId } from '@testing-library/react';


jest.mock('react-native-webview', () => {
    const React = require('react');
    const MockWebView = ({ children, ...props }) => <div {...props}>{children}</div>;
    return { WebView: MockWebView };
  });

jest.mock('../../../../app/screens/PostLoginScreens/Home/UseEditorScreen');

jest.mock('../../../../app/components/Theme');

jest.mock('../../../../app/styles/GloballySharedStyles', () => () => ({ avoidingTabBarContainer: {} }));

jest.mock('../../../../app/styles/LocallySharedStylesHomeScreens', () => () => ({ backgroundContainer: {}, mediumTopPadding: {} }));

const mockUseEditorScreen = require('../../../../app/screens/PostLoginScreens/Home/UseEditorScreen').useEditorScreen;

describe('EditorScreen', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseEditorScreen.mockImplementation((filePath, theme) => ({
            codeHtml: '<html></html>',
            isLoading: false
        }));
    });
    const mockedNavigate = jest.fn();
    const renderEditorScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <NavigationContainer>
                    <EditorScreen route={{ params: { filePath: 'test/path' } }} navigation={{ navigate: mockedNavigate }} />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    };

    it('renders correctly with loading indicator', () => {
        mockUseEditorScreen.mockImplementation(() => ({
            codeHtml: '',
            isLoading: true
        }));

        const { getByTestId } = renderEditorScreen();

        expect(getByTestId('activityIndicatorTestID')).toBeTruthy();
    });

    it('renders WebView when not loading', () => {
        mockUseEditorScreen.mockImplementation(() => ({
            codeHtml: '<html>Code</html>',
            isLoading: false
        }));

        const { getByTestId } = renderEditorScreen();

        expect(getByTestId('webViewTestID')).toBeTruthy();
    });
});
