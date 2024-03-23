import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
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
        <View style={[styles.container]}>
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
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 234, left: 0, right: 0 }} />
            <View style={[styles.inputContainer, { paddingBottom: '20%', paddingTop: '5%' }]}>
                <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[styles.input, { width: 300 }]}
                />
                <TouchableOpacity  title="Post Comment" style={[styles.button, { width: 300 }]} onPress={() => handleAddComment(newComment)}>
                    <Text style={styles.buttonText}>Post Comment</Text> 
                </TouchableOpacity>
            </View>
            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </View>
    );
};

export default CommentScreen;
