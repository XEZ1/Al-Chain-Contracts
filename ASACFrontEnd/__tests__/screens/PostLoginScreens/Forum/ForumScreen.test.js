import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { waitFor } from '@testing-library/react-native';
import ForumScreen from '../../../../app/screens/PostLoginScreens/Forum/ForumScreen';
import { useForumScreen } from '../../../../app/screens/PostLoginScreens/Forum/UseForumScreen';
import { ThemeContext } from '../../../../app/components/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),    
    };
});

jest.mock('../../../../app/screens/PostLoginScreens/Forum/UseForumScreen');

jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        MaterialCommunityIcons: ({ name, size, color, testID }) => (
            <Text testID={testID}>{`icon-${name}`}</Text>
        ),
    };
});

const mockedNavigate = jest.fn();

describe('ForumScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const createPost = jest.fn();
        const handleLikePost = jest.fn();
        const handleDeletePost = jest.fn();
        const setNewPostTitle = jest.fn();
        const setNewPostDescription = jest.fn();
        useForumScreen.mockReturnValue(() => ({
            posts: [],
            loading: false,
            createPost,
            handleLikePost,
            handleDeletePost,
            newPostTitle: '',
            setNewPostTitle,
            newPostDescription: '',
            setNewPostDescription,
        }));
        
    });

    const renderForumScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <NavigationContainer>
                    <ForumScreen navigation={{ navigate: mockedNavigate }} />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderForumScreen();

        expect(getByText('Community Forum')).toBeTruthy();
        expect(getByText('Post')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByPlaceholderText } = renderForumScreen('light');

        const postTitle = getByPlaceholderText("Title...");
        const postDescription = getByPlaceholderText("Description...");

        const postTitleColour = postTitle.props.placeholderTextColor;
        const postDescriptionColour = postDescription.props.placeholderTextColor;

        expect(postTitleColour).toEqual('darkgrey');
        expect(postDescriptionColour).toEqual('darkgrey');

    });

    it('renders correctly with dark theme', () => {
        const { getByPlaceholderText } = renderForumScreen('dark');

        const postTitle = getByPlaceholderText("Title...");
        const postDescription = getByPlaceholderText("Description...");

        const postTitleColour = postTitle.props.placeholderTextColor;
        const postDescriptionColour = postDescription.props.placeholderTextColor;

        expect(postTitleColour).toEqual('grey');
        expect(postDescriptionColour).toEqual('grey');
    });

    it('displays a loading indicator when data is loading', () => {
        useForumScreen.mockReturnValueOnce({ ...useForumScreen(), loading: true });

        const { getByText } = renderForumScreen();

        expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders posts when provided', () => {
        useForumScreen.mockReturnValueOnce({
            ...useForumScreen(),
            posts: [{ id: '1', title: 'Test Post', description: 'A test post', user_has_liked: false, like_count: 0, is_user_author: true }],
        });

        const { getByText } = renderForumScreen();

        expect(getByText('Test Post')).toBeTruthy();
        expect(getByText('A test post')).toBeTruthy();
    });

    it('handles like button press (like)', async () => {
        const handleLikePost = jest.fn();
        useForumScreen.mockReturnValueOnce({
            ...useForumScreen(),
            posts: [{ id: '1', title: 'Test Post', description: 'A test post', user_has_liked: false, like_count: 0, is_user_author: true }], handleLikePost
        });

        const { getByTestId } = renderForumScreen();
        fireEvent.press(getByTestId('likeButtonTestID'));

        await waitFor(() => {
            expect(handleLikePost).toHaveBeenCalledWith('1', false);
        });
    });

    it('handles like button press (like deletion)', async () => {
        const handleLikePost = jest.fn();
        useForumScreen.mockReturnValueOnce({
            posts: [{ id: '1', title: 'Test Post', description: 'A test post', user_has_liked: true, like_count: 1, is_user_author: true }],
            handleLikePost
        });
        
        const { getByTestId } = renderForumScreen();
        fireEvent.press(getByTestId('likeButtonTestID'));

        await waitFor(() => {
            expect(handleLikePost).toHaveBeenCalledWith('1', true);
        });
    });    

    it('handles delete post', async () => {
        const handleDeletePost = jest.fn();
        useForumScreen.mockReturnValueOnce({
            ...useForumScreen(),
            posts: [{ id: '1', title: 'Test Post', description: 'A test post', user_has_liked: false, like_count: 0, is_user_author: true }],
            handleDeletePost,
        });

        const { getByText } = renderForumScreen();
        fireEvent.press(getByText('Delete'));

        await waitFor(() => {
            expect(handleDeletePost).toHaveBeenCalledWith('1');
        });
    });

    it('navigates to CommentScreen when comment button is pressed', () => {
        useForumScreen.mockReturnValueOnce({
            ...useForumScreen(),
            posts: [{ id: '1', title: 'Test Post', description: 'A test post', user_has_liked: false, like_count: 0, is_user_author: true }],
        });

        const { getByText } = renderForumScreen();
        fireEvent.press(getByText('Comment'));

        expect(mockedNavigate).toHaveBeenCalledWith('CommentScreen', { postId: '1' });
    });
});
