import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { UseCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';

const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const postId = route?.params?.postId;

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

    return (
        <View style={[styles.container, { paddingBottom: 0 }]}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.comment}>{`${item.author_username}: ${item.content}`}</Text>
                    </View>
                )}
                style={{ width: '100%' }}
            />
            <View style={[styles.inputContainer, { paddingBottom: '30%' }]}>
                <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={styles.input}
                />
                <Button title="Post Comment" color={theme === 'dark' ? '#1A1A1A' : 'rgba(1, 193, 219, 1)'} onPress={() => handleAddComment(newComment)} />
            </View>
            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </View>
    );
};

export default CommentScreen;
