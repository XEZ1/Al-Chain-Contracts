import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../../components/Keyboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForumScreen } from './UseForumScreen';
import { useCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesForumScreens from '../../../styles/LocallySharedStylesForumScreens';


/**
 * CommentScreen component displays a post's details along with its comments.
 * It allows users to like the post, delete the post (if the user is the author), and add new comments.
 * 
 * @param {object} route - React Navigation route object containing the postId in params.
 * @param {object} navigation - React Navigation navigation object for navigating between screens.
 * @returns {JSX.Element} - Rendered component for the comment screen.
 */
const CommentScreen = ({ route, navigation }) => {
    // Access the current theme from the ThemeContext
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesForumScreens(theme);

    // Reference for the comment input field
    const postCommentRef = useRef(null);
    // Reference for the FlatList view (to control the focus when the keyboard is open)
    const viewRef = useRef(null);
    // Custom hook to manage keyboard state
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    // Retrieve the postId from the route params
    const { postId } = route.params;
    // Custom hooks to manage the forum screen logic
    const { posts, handleLikePost, handleDeletePost } = useForumScreen();
    // Retrieve the post details using the postId
    const postDetails = posts.find(p => p.id === postId);

    // Custom hook for comment screen logic
    const {
        comments, newComment, setNewComment,
        fetchComments, handleAddComment
    } = useCommentScreen(postId);

    /**
     * Fetch comments for the post when the component mounts
     */
    useEffect(() => {
        fetchComments();
    }, []);

    /**
     * Registers and unregisters the FlatList view reference when the screen is focused or unfocused.
     */
    useFocusEffect(
        useCallback(() => {
            const id = "CommentScreen";
            registerScrollViewRef(id, viewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
    );

    /**
     * Redirect to the Forum screen if the post does not exist in the comments screen
     * Happens when a user deletes the post from the Comments screen
     */
    useEffect(() => {
        const postExists = posts.find(p => p.id === postId);
        if (!postExists) {
            navigation.navigate('ForumScreen')
        }
    }, [posts, postId, navigation]);

    if (!postDetails) {
        // Return null if post details are not found
        return null;
    }

    return (
        <View style={[sharedStyles.container, localStyles.zeroTopPadding, localStyles.stretchedContainer, {paddingBottom: keyboardHeight}]}>
            <FlatList
                style={sharedStyles.mediumMarginBottom}
                ref={viewRef}
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[sharedStyles.container, localStyles.zeroPadding]}>
                        <View style={sharedStyles.cardContainer}>
                            <Text style={sharedStyles.generalText}>{`${item.author_username}: ${item.content}`}</Text>
                        </View>
                    </View>
                )}
                
                ListHeaderComponent={
                    <View style={[sharedStyles.container, localStyles.zeroPadding]}>
                        <View style={[sharedStyles.cardContainer, localStyles.mediumTopMargin]}>
                            <Text style={sharedStyles.cardHeaderText}>{postDetails.title}</Text>
                            <Text style={[sharedStyles.generalText, sharedStyles.bigFont, localStyles.smallMargin]}>{postDetails.description}</Text>

                            <View style={sharedStyles.rowCenteredContainer}>
                                <TouchableOpacity
                                    testID='likeButtonTestID'
                                    onPress={() => handleLikePost(postDetails.id, postDetails.user_has_liked)}
                                    style={sharedStyles.rowCenteredContainer}>
                                    <MaterialCommunityIcons name={postDetails.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" testID='likeIconTestID'/>
                                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Like ({postDetails.like_count})</Text>
                                </TouchableOpacity>
                                {postDetails.is_user_author && (
                                    <TouchableOpacity
                                        onPress={() => handleDeletePost(postDetails.id)}
                                        style={sharedStyles.rowCenteredContainer}>
                                        <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                                        <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Delete</Text>
                                    </TouchableOpacity>
                                )}

                            </View>
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View style={[sharedStyles.container, localStyles.zeroPadding]}>
                        <TextInput
                            ref={postCommentRef}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Write a comment..."
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            style={[sharedStyles.inputField, localStyles.adjustedWidth]}
                        />
                        <TouchableOpacity title="Post Comment" style={[sharedStyles.button, localStyles.adjustedWidth, localStyles.mediumMargin]} onPress={() => { handleAddComment(newComment); setNewComment(''); }}>
                            <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Post Comment</Text>
                        </TouchableOpacity>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
            {/* Separator Line */}
            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight + 90 }]} />
        </View>

    );
};

export default CommentScreen;
