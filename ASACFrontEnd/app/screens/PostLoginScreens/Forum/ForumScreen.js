import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../../styles/SharedStyles'; // Make sure the path to your styles is correct
import { ThemeContext } from '../../../components/Theme';
import { useForumScreen } from './UseForumScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getLocalStyles from './LocalSharedStyles';


const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);
    
    const { posts, loading, createPost, handleLikePost, handleDeletePost, 
        newPostTitle, setNewPostTitle, 
        newPostDescription, setNewPostDescription 
    } = useForumScreen();

    if (loading) {
        return (
            <View style={sharedStyles.container}><Text>Loading...</Text></View>
        );
    }

    const renderPost = ({ item }) => (
        <View style={sharedStyles.card}>
            <Text style={sharedStyles.cardHeader}>{item.title}</Text>
            <Text style={sharedStyles.settingText}>{item.description}</Text>
            <View style={sharedStyles.postsContainer}>
                <TouchableOpacity
                    onPress={() => handleLikePost(item.id, item.user_has_liked)}
                    style={sharedStyles.postsButtonText}>
                    <MaterialCommunityIcons
                        name={item.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                    <Text style={sharedStyles.buttonText}>Like({item.like_count})</Text>
                </TouchableOpacity>
                {item.is_user_author && (
                    <TouchableOpacity
                        onPress={() => handleDeletePost(item.id)}
                        style={sharedStyles.postsButtonText}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                        <Text style={sharedStyles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('CommentScreen', { postId: item.id })}
                    style={sharedStyles.postsButtonText}>
                    <MaterialCommunityIcons name="comment-text-outline" size={24} color="grey" />
                    <Text style={sharedStyles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={sharedStyles.container}
            behavior="padding"
        >
            <Text style={sharedStyles.header}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={sharedStyles.postsViewContainer}>
                <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder='Title...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={sharedStyles.inputForumScreen}
                />
                <TextInput
                    value={newPostDescription}
                    onChangeText={setNewPostDescription}
                    placeholder='Description...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[sharedStyles.inputForumScreen, { flex: 2 }]}
                />
                <TouchableOpacity onPress={createPost} style={sharedStyles.buttonForumScreen}>
                    <Text style={sharedStyles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>

            <View style={[sharedStyles.separatorLine, { bottom: 635 }]} />

            {/* List of Posts */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                style={sharedStyles.flatListPostsContainer}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={sharedStyles.listFooterContainer} />}
            />

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </KeyboardAvoidingView>

    );
};

export default ForumScreen;
