import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../../styles/SharedStyles'; // Make sure the path to your styles is correct
import { ThemeContext } from '../../../components/Theme';
import { useForumScreen } from './UseForumScreen';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { posts, loading, createPost, handleLikePost, handleAddComment } = useForumScreen();
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDescription, setNewPostDescription] = useState('');

    const handleCreatePost = async () => {
        if (!newPostTitle.trim() || !newPostDescription.trim()) {
            Alert.alert('Error', 'Title and description cannot be empty.');
            return;
        }
        await createPost(newPostTitle, newPostDescription);
        setNewPostTitle('');
        setNewPostDescription('');
    };

    const renderPost = ({ item }) => (
        <View style={[styles.card, { width: '97%' }]}>
            <Text style={styles.cardHeader}>{item.title}</Text>
            <Text style={styles.settingText}>{item.description}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => handleLikePost(item.id, item.user_has_liked)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 110 }}>
                    <MaterialCommunityIcons
                        name={item.user_has_liked ? "heart" : "heart-outline"} size={24} color="red" />
                    <Text style={styles.buttonText}>Like ({item.like_count})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddComment(item.id, 'hey')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="comment-text-outline" size={24} color="grey" />
                    <Text style={styles.buttonText}>Comment</Text>
                </TouchableOpacity>
            </View>
            {/* This comparison needs to be adjusted based on your authentication and user identification logic */}
            {item.author.id === SecureStore.getItemAsync('authToken') && (
                <TouchableOpacity
                    style={[styles.button, { marginTop: 10 }]}
                    onPress={() => handleDeletePost(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            )}
        </View>

    );

    if (loading) {
        return (
            <View style={styles.container}><Text>Loading...</Text></View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.header}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={{ flexDirection: 'row', marginBottom: '5%' }}>
                <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder='Title...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                />
                <TextInput
                    value={newPostDescription}
                    onChangeText={setNewPostDescription}
                    placeholder='Description...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[styles.input, { flex: 2, marginRight: 10 }]}
                />
                <TouchableOpacity onPress={handleCreatePost} style={[styles.button, { width: 'auto', paddingHorizontal: 20 }]}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>

            {/* List of Posts */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                style={{ flex: 1, marginBottom: 90 }}
            />

            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </KeyboardAvoidingView>

    );
};

export default ForumScreen;
