import React, { useContext, useState, useEffect, useRef } from 'react';
import { LayoutAnimation, View, Text, TextInput, TouchableOpacity, FlatList, findNodeHandle, Keyboard, Dimensions } from 'react-native';
import { useCommentScreen } from './UseCommentScreen';
import { useForumScreen } from './UseForumScreen';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getLocalStyles from './LocalSharedStyles';


const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);

    const postCommentRef = useRef(null);
    const viewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { postId } = route.params;
    const { posts, handleLikePost, handleDeletePost } = useForumScreen();
    const postDetails = posts.find(p => p.id === postId);

    const {
        comments, newComment, setNewComment,
        fetchComments, handleAddComment
    } = useCommentScreen(postId);

    useEffect(() => {
        fetchComments();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const handleKeyboardDidShow = (e) => {
                const screenHeight = Dimensions.get('window').height;
                const endY = e.endCoordinates.screenY;
                LayoutAnimation.easeInEaseOut();
                setKeyboardHeight(screenHeight - endY - 90);
                const currentlyFocusedField = TextInput.State.currentlyFocusedInput();

                if (currentlyFocusedField) {
                    const nodeHandle = findNodeHandle(currentlyFocusedField);
                    viewRef.current?.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
                        nodeHandle,
                        160,
                        true
                    );
                }
            };

            const handleKeyboardDidHide = () => {
                LayoutAnimation.easeInEaseOut();
                setKeyboardHeight(0);
            };

            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, [])
    );

    useEffect(() => {
        const postExists = posts.find(p => p.id === postId);
        if (!postExists) {
            navigation.navigate('ForumScreen')
        }
    }, [posts, postId, navigation]);

    if (!postDetails) {
        return null;
    }

    return (
        <View style={[localStyles.containerCommentScreen, { paddingBottom: keyboardHeight }]}>
            <FlatList
                ref={viewRef}
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={sharedStyles.card}>
                        <Text style={localStyles.generalText}>{`${item.author_username}: ${item.content}`}</Text>
                    </View>
                )}
                style={localStyles.flatListCommentsContainer}
                ListHeaderComponent={
                    <View style={[sharedStyles.card, {marginTop: '7%'}]}>
                        <Text style={sharedStyles.cardHeader}>{postDetails.title}</Text>
                        <Text style={localStyles.settingText}>{postDetails.description}</Text>
                        <View style={localStyles.postsContainer}>
                            <TouchableOpacity
                                onPress={() => handleLikePost(postDetails.id, postDetails.user_has_liked)}
                                style={localStyles.postsButtonText}>
                                <MaterialCommunityIcons
                                    name={postDetails.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                                <Text style={localStyles.buttonText}>Like ({postDetails.like_count})</Text>
                            </TouchableOpacity>
                            {postDetails.is_user_author && (
                                <TouchableOpacity
                                    onPress={() => handleDeletePost(postDetails.id)}
                                    style={localStyles.postsButtonText}>
                                    <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                                    <Text style={localStyles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View style={localStyles.centeredContainer}>
                        <TextInput
                            ref={postCommentRef}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Write a comment..."
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            style={localStyles.inputField}
                        />
                        <TouchableOpacity title="Post Comment" style={localStyles.buttonCommentsScreen} onPress={() => { handleAddComment(newComment); setNewComment(''); }}>
                            <Text style={localStyles.buttonText}>Post Comment</Text>
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
