import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CommentScreen from '../../../../app/screens/PostLoginScreens/Forum/CommentScreen';
import { useForumScreen } from '../../../../app/screens/PostLoginScreens/Forum/UseForumScreen';
import { useCommentScreen } from '../../../../app/screens/PostLoginScreens/Forum/UseCommentScreen';
import { useKeyboard } from '../../../../app/components/Keyboard';
import { ThemeContext } from '../../../../app/components/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn((callback) => {
            const unsubscribe = callback();
            return () => {
                unsubscribe();
            };
        }),
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
    };
});

jest.mock('../../../../app/screens/PostLoginScreens/Forum/UseForumScreen', () => ({
    useForumScreen: jest.fn()
}));

jest.mock('../../../../app/screens/PostLoginScreens/Forum/UseCommentScreen', () => ({
    useCommentScreen: jest.fn()
}));

jest.mock('../../../../app/components/Keyboard', () => {
    const registerScrollViewRef = jest.fn();
    const unregisterScrollViewRef = jest.fn();
    return {
        useKeyboard: jest.fn(() => ({
            keyboardHeight: 100,
            registerScrollViewRef,
            unregisterScrollViewRef,
        })),
    };
});

jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        MaterialCommunityIcons: ({ name, size, color, testID }) => (
            <Text testID={testID}>{`icon-${name}`}</Text>
        ),
    };
});

const mockedNavigate = jest.fn();
const mockedRoute = {
    params: { postId: '1' }
};

describe('CommentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const createPost = jest.fn();
        const handleLikePost = jest.fn();
        const handleDeletePost = jest.fn();
        const setNewPostTitle = jest.fn();
        const setNewPostDescription = jest.fn();
        useForumScreen.mockReturnValue({
            posts: [{
                id: '1',
                title: 'Test Post',
                description: 'A test post',
                like_count: 0,
                user_has_liked: false,
                is_user_author: true
            }],
            handleLikePost,
            handleDeletePost
        });

        const setNewComment = jest.fn();
        const fetchComments = jest.fn();
        const handleAddComment = jest.fn();
        useCommentScreen.mockReturnValue({
            comments: [],
            newComment: '',
            setNewComment,
            fetchComments,
            handleAddComment
        });
    });

    const renderCommentScreen = (theme = 'light') => {
        return render(
            <ThemeContext.Provider value={{ theme }}>
                <NavigationContainer>
                    <CommentScreen route={mockedRoute} navigation={{ navigate: mockedNavigate }} />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    };
    
    it('renders correctly', () => {
        const { getByText } = renderCommentScreen();

        expect(getByText('Test Post')).toBeTruthy();
        expect(getByText('A test post')).toBeTruthy();
        expect(getByText('Like (0)')).toBeTruthy();
        expect(getByText('Delete')).toBeTruthy();  
        expect(useCommentScreen().fetchComments).toHaveBeenCalled();
    });

    it('renders correctly with light theme', () => {
        const { getByPlaceholderText } = renderCommentScreen('light');

        const postComment = getByPlaceholderText("Write a comment...");

        const postCommentColour = postComment.props.placeholderTextColor;

        expect(postCommentColour).toEqual('darkgrey');
    });

    it('renders correctly with dark theme', () => {
        const { getByPlaceholderText } = renderCommentScreen('dark');

        const postComment = getByPlaceholderText("Write a comment...");

        const postCommentColour = postComment.props.placeholderTextColor;

        expect(postCommentColour).toEqual('grey');
    });

    it('renders comments and applies keyExtractor correctly', async () => {
        useCommentScreen.mockReturnValue({
            comments: [
                { id: '101', author_username: 'JohnDoe', content: 'Great post!' },
                { id: '102', author_username: 'JaneDoe', content: 'Thanks for sharing!' }
            ],
            newComment: '',
            setNewComment: jest.fn(),
            fetchComments: jest.fn(),
            handleAddComment: jest.fn()
        });
    
        const { getByText } = renderCommentScreen();
    
        await waitFor(() => {
            expect(getByText('JohnDoe: Great post!')).toBeTruthy();
            expect(getByText('JaneDoe: Thanks for sharing!')).toBeTruthy();
        });
    });

    it('displays correct icon based on like status', async () => {
        useForumScreen.mockReturnValue({
            posts: [{
                id: '1',
                title: 'Test Post',
                description: 'A test post',
                like_count: 0,
                user_has_liked: false,
                is_user_author: true
            }],
            handleLikePost: jest.fn(),
            handleDeletePost: jest.fn()
        });
    
        const { getByTestId, getByText, rerender } = renderCommentScreen();
        expect(getByTestId('likeIconTestID')).toBeTruthy();
        expect(getByText('icon-heart-outline')).toBeTruthy();
    
        useForumScreen.mockReturnValue({
            posts: [{
                id: '1',
                title: 'Test Post',
                description: 'A test post',
                like_count: 1,
                user_has_liked: true, 
                is_user_author: true
            }],
            handleLikePost: jest.fn(),
            handleDeletePost: jest.fn()
        });
    
        rerender(
            <ThemeContext.Provider value={{ theme: 'light' }}>
                <NavigationContainer>
                    <CommentScreen route={mockedRoute} navigation={{ navigate: mockedNavigate }} />
                </NavigationContainer>
            </ThemeContext.Provider>
        );
    
        expect(getByTestId('likeIconTestID')).toBeTruthy();
        expect(getByText('icon-heart')).toBeTruthy();
    });
    
    
    it('handles adding a new comment', async () => {
        const { getByPlaceholderText, getByText } = renderCommentScreen();
        const newCommentInput = getByPlaceholderText('Write a comment...');
        fireEvent.changeText(newCommentInput, 'New comment');
    
        fireEvent.press(getByText('Post Comment'));

        await waitFor(() => {
            expect(useCommentScreen().handleAddComment).toHaveBeenCalled();
            expect(useCommentScreen().setNewComment).toHaveBeenCalledWith('');
        });
    });

    it('handles like and delete operations', async () => {
        const { getByTestId, getByText } = renderCommentScreen();
    
        fireEvent.press(getByTestId('likeButtonTestID'));
        await waitFor(() => {
            expect(useForumScreen().handleLikePost).toHaveBeenCalledWith('1', false);
        });
    
        fireEvent.press(getByText('Delete'));
        await waitFor(() => {
            expect(useForumScreen().handleDeletePost).toHaveBeenCalledWith('1');
        });
    });

    it('navigates back if the post does not exist', async () => {
        useForumScreen.mockReturnValue({
            posts: [], 
            handleLikePost: jest.fn(),
            handleDeletePost: jest.fn()
        });
    
        renderCommentScreen();
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('ForumScreen');
        });
    });

    it('registers and unregisters the scroll view ref', async () => {
        const { getByPlaceholderText } = renderCommentScreen();

        const field = getByPlaceholderText("Write a comment...");
        fireEvent.press(field);

        await waitFor(() => expect(useKeyboard().registerScrollViewRef).toHaveBeenCalled());

        useNavigation().goBack();
        const cleanup = useFocusEffect.mock.calls[0][0]();
        cleanup();

        await waitFor(() => {
            expect(useKeyboard().unregisterScrollViewRef).toHaveBeenCalledWith('CommentScreen');
        });
    });
    

});
