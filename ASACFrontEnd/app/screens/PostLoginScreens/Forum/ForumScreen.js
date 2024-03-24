import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../../styles/SharedStyles'; // Make sure the path to your styles is correct
import { ThemeContext } from '../../../components/Theme';
import { useForumScreen } from './UseForumScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    
    const { posts, loading, createPost, handleLikePost, handleDeletePost, 
        newPostTitle, setNewPostTitle, 
        newPostDescription, setNewPostDescription 
    } = useForumScreen();

    if (loading) {
        return (
            <View style={styles.container}><Text>Loading...</Text></View>
        );
    }

    const renderPost = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{item.title}</Text>
            <Text style={styles.settingText}>{item.description}</Text>
            <View style={styles.postsContainer}>
                <TouchableOpacity
                    onPress={() => handleLikePost(item.id, item.user_has_liked)}
                    style={styles.postsButtonText}>
                    <MaterialCommunityIcons
                        name={item.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                    <Text style={styles.buttonText}>Like({item.like_count})</Text>
                </TouchableOpacity>
                {item.is_user_author && (
                    <TouchableOpacity
                        onPress={() => handleDeletePost(item.id)}
                        style={styles.postsButtonText}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('CommentScreen', { postId: item.id, post: item })}
                    style={styles.postsButtonText}>
                    <MaterialCommunityIcons name="comment-text-outline" size={24} color="grey" />
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.header}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={styles.postsViewContainer}>
                <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder='Title...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={styles.inputForumScreen}
                />
                <TextInput
                    value={newPostDescription}
                    onChangeText={setNewPostDescription}
                    placeholder='Description...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[styles.inputForumScreen, { flex: 2 }]}
                />
                <TouchableOpacity onPress={createPost} style={styles.buttonForumScreen}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.separatorLine, { bottom: 634 }]} />

            {/* List of Posts */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                style={styles.flatListPostsContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Separator Line */}
            <View style={styles.separatorLine} />
        </KeyboardAvoidingView>

    );
};

export default ForumScreen;
