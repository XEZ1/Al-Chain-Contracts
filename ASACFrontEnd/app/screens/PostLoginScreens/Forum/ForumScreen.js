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
        <View style={[sharedStyles.container, { paddingTop: '0%', padding: '0%' }]}>
            <View style={sharedStyles.cardContainer}>
                <Text style={sharedStyles.cardHeaderText}>{item.title}</Text>
                <Text style={[sharedStyles.generalText, { fontSize: 18 }]}>{item.description}</Text>
                <View style={localStyles.postsContainer}>
                    <TouchableOpacity
                        onPress={() => handleLikePost(item.id, item.user_has_liked)}
                        style={localStyles.postsButton}>
                        <MaterialCommunityIcons
                            name={item.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                        <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Like({item.like_count})</Text>
                    </TouchableOpacity>
                    {item.is_user_author && (
                        <TouchableOpacity
                            onPress={() => handleDeletePost(item.id)}
                            style={localStyles.postsButton}>
                            <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                            <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Delete</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CommentScreen', { postId: item.id })}
                        style={localStyles.postsButton}>
                        <MaterialCommunityIcons name="comment-text-outline" size={24} color="grey" />
                        <Text style={[sharedStyles.generalText, { fontSize: 16, fontWeight: 'bold' }]}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={sharedStyles.container}
            behavior="padding"
        >
            <Text style={sharedStyles.pageHeaderText}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={localStyles.postsViewContainer}>
                <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder='Title...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[localStyles.inputField, { flex: 1, marginRight: 10, marginBottom: '0%' }]}
                />
                <TextInput
                    value={newPostDescription}
                    onChangeText={setNewPostDescription}
                    placeholder='Description...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[localStyles.inputField, { flex: 2, marginRight: 10, marginBottom: '0%' }]}
                />
                <TouchableOpacity onPress={createPost} style={[sharedStyles.button, { width: '20%', marginBottom: '0%', }]}>
                    <Text style={localStyles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>

            <View style={[sharedStyles.separatorLine, { bottom: 635 }]} />

            {/* List of Posts */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                style={[sharedStyles.avoidingTabBarContainer, { paddingTop: 25 }]}
                showsVerticalScrollIndicator={false}
            />

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </KeyboardAvoidingView>

    );
};

export default ForumScreen;
