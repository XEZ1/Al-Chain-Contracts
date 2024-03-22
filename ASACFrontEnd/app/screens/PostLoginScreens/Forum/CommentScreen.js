import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { UseCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme';
import getStyles from '../../../styles/SharedStyles';

const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const postId = route?.params?.postId;
    if (!postId) {
        console.error('No postId provided to CommentScreen');
        return null;
    }
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
                        {/* Ensure item.author.username and item.content are strings */}
                        <Text style={styles.comment}>{`${item.author.username}: ${item.content}`}</Text>
                    </View>
                )}
                style={{ width: '100%' }}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={styles.input}
                />
                <Button title="Post Comment" color={theme === 'dark' ? '#1A1A1A' : 'rgba(1, 193, 219, 1)'} onPress={() => handleAddComment(newComment)} />
            </View>
        </View>
    );
};

export default CommentScreen;
