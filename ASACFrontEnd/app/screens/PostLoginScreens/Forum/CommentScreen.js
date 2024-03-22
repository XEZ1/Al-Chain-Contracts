import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { UseCommentScreen } from './UseCommentScreen';
import { ThemeContext } from '../../../components/Theme'; // Adjust the path as necessary
import getStyles from '../../../styles/SharedStyles'; // Adjust the path as necessary

const CommentScreen = ({ route, navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { postId } = route.params;
    const { fetchComments, handleAddComment } = UseCommentScreen(postId); // Assuming UseCommentScreen accepts postId as an argument

    useEffect(() => {
        fetchComments().then(setComments); // Assuming fetchComments returns a promise that resolves to the comments
    }, [fetchComments]);

    return (
        <View style={[styles.container, { paddingBottom: 0 }]}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.comment}>{item.author.username}: {item.content}</Text> {/* Adjust if your data structure is different */}
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
