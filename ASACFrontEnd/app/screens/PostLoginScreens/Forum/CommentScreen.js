import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, FlatList, findNodeHandle, Keyboard, Dimensions } from 'react-native';
import { UseCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';
import { useFocusEffect } from '@react-navigation/native';

const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const postId = route?.params?.postId;

    const postCommentRef = useRef(null);
    const viewRef = useRef(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const {
        comments,
        newComment,
        setNewComment,
        fetchComments,
        handleAddComment,
    } = UseCommentScreen(postId);

    useEffect(() => {
        fetchComments();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const handleKeyboardDidShow = (e) => {
                const screenHeight = Dimensions.get('window').height;
                const endY = e.endCoordinates.screenY;
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
                    <View>
                        {/* Any component you want above the list */}
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
