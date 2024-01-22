import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../styles/SharedStyles'; // Make sure the path to your styles is correct
import { ThemeContext } from '../../components/Theme';

const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);


    // Dummy data for forum posts
    const forumPosts = [
        { id: '1', title: 'Welcome to the Forum!', description: 'Introduce yourself to the community here!' },
        { id: '2', title: 'FAQs', description: 'Find answers to frequently asked questions.' },
        // ... more posts
    ];

    const renderPost = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{item.title}</Text>
            <Text style={styles.settingText}>{item.description}</Text>
            <TouchableOpacity style={[styles.button, { marginTop: 10 }]}>
                <Text style={styles.buttonText}>Join Discussion</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior="padding"
        >
            <Text style={styles.header}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <TextInput
                    placeholder='Search the forum...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                />
                <TouchableOpacity style={[styles.button, { width: 'auto', paddingHorizontal: 20 }]}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>

            {/* List of Posts */}
            <FlatList
                data={forumPosts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                style={{ flex: 1 }}
            />

            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </KeyboardAvoidingView>
    );
};

export default ForumScreen;
