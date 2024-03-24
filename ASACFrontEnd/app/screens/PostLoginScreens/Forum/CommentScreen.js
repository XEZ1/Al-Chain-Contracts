import React, { useContext, useState, useEffect, useRef } from 'react';
import { LayoutAnimation, View, Text, TextInput, TouchableOpacity, FlatList, findNodeHandle, Keyboard, Dimensions } from 'react-native';
import { useCommentScreen } from './UseCommentScreen';
import { useForumScreen } from './UseForumScreen';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BACKEND_URL } from '@env';

const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const { postId, post } = route.params;

    const postCommentRef = useRef(null);
    const viewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { posts, handleLikePost, handleDeletePost } = useForumScreen(); 
    const postDetails = posts.find(p => p.id === postId);

    const {
        comments,
        newComment, setNewComment,
        fetchComments, handleAddComment,
    } = useCommentScreen(postId);

    useEffect(() => {
        const postExists = posts.find(p => p.id === postId);
        if (!postExists) {
            navigation.navigate('ForumScreen')
        }
    }, [posts, postId, navigation]);

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

    if (!postDetails) {
        return null;
    }

    return (
        <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
            <FlatList
                ref={viewRef}
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.comment}>{`${item.author_username}: ${item.content}`}</Text>
                    </View>
                )}
                style={{ width: '100%', marginBottom: 90 }}
                ListHeaderComponent={
                    <View style={[styles.card, { width: '97%' }]}>
                        <Text style={styles.cardHeader}>{postDetails.title}</Text>
                        <Text style={styles.settingText}>{postDetails.description}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => handleLikePost(postDetails.id, postDetails.user_has_liked)}
                                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 0 }}>
                                <MaterialCommunityIcons
                                    name={postDetails.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                                <Text style={styles.buttonText}>Like ({postDetails.like_count})</Text>
                            </TouchableOpacity>
                            {postDetails.is_user_author && (
                                <TouchableOpacity
                                    onPress={() => handleDeletePost(postDetails.id)}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View>
                        <TextInput
                            ref={postCommentRef}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Write a comment..."
                            placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                            style={[styles.input,]}
                        />
                        <TouchableOpacity title="Post Comment" style={[styles.button]} onPress={() => handleAddComment(newComment)}>
                            <Text style={styles.buttonText}>Post Comment</Text>
                        </TouchableOpacity>


                    </View>
                }
            />
            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </View>

    );
};

export default CommentScreen;
