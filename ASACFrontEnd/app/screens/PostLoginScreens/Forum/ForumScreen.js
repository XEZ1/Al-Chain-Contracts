import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../../styles/SharedStyles'; // Make sure the path to your styles is correct
import { ThemeContext } from '../../../components/Theme';
import { useForumScreen } from './UseForumScreen';

const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { posts, loading, createPost } = useForumScreen();
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDescription, setNewPostDescription] = useState('');

    const forumPosts = [
        { id: '1', title: 'Welcome to the Forum!', description: 'Introduce yourself to the community here!' },
        { id: '2', title: 'FAQs', description: 'Find answers to frequently asked questions.' },
    ];

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
            <TouchableOpacity style={[styles.button, { marginTop: 10 }]}>
                <Text style={styles.buttonText}>Join Discussion</Text>
            </TouchableOpacity>
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
