import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../../components/Keyboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForumScreen } from './UseForumScreen';
import { useCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesForumScreens from '../../../styles/LocallySharedStylesForumScreens';


const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesForumScreens(theme);

    const postCommentRef = useRef(null);
    const viewRef = useRef(null);
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

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
        useCallback(() => {
            const id = "ForumScreen";
            registerScrollViewRef(id, viewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
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
        <View style={[sharedStyles.container, localStyles.zeroTopPadding, localStyles.stretchedContainer, {paddingBottom: keyboardHeight}]}>
            <FlatList
                style={sharedStyles.avoidingTabBarContainer}
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
                                    onPress={() => handleLikePost(postDetails.id, postDetails.user_has_liked)}
                                    style={sharedStyles.rowCenteredContainer}>
                                    <MaterialCommunityIcons name={postDetails.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
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
