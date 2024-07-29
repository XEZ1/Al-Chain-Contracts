import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForumScreen } from './UseForumScreen';
import { useKeyboard } from '../../../components/Keyboard';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles'; 
import getLocallySharedStylesForumScreens from '../../../styles/LocallySharedStylesForumScreens';


const ForumScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesForumScreens(theme);

    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

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
        <View style={[sharedStyles.container, localStyles.zeroPadding]}>
            <View style={sharedStyles.cardContainer}>
                <Text style={sharedStyles.cardHeaderText}>{item.title}</Text>
                <Text style={[sharedStyles.generalText, { fontSize: 18 }]}>{item.description}</Text>
                <View style={[sharedStyles.rowCenteredContainer, { marginTop: '3.5%' }]}>
                    <TouchableOpacity
                        testID='likeButtonTestID'
                        onPress={() => handleLikePost(item.id, item.user_has_liked)}
                        style={sharedStyles.rowCenteredContainer}>
                        <MaterialCommunityIcons
                            name={item.user_has_liked ? "heart" : "heart-outline"} size={24} color="rgba(1, 193, 219, 1)" />
                        <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Like({item.like_count})</Text>
                    </TouchableOpacity>
                    {item.is_user_author && (
                        <TouchableOpacity
                            onPress={() => handleDeletePost(item.id)}
                            style={sharedStyles.rowCenteredContainer}>
                            <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                            <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Delete</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CommentScreen', { postId: item.id })}
                        style={sharedStyles.rowCenteredContainer}>
                        <MaterialCommunityIcons name="comment-text-outline" size={24} color="grey" />
                        <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[sharedStyles.container, localStyles.zeroBottomPadding]}>
            <Text style={sharedStyles.pageHeaderText}>Community Forum</Text>

            {/* Search or Create Post Input */}
            <View style={[sharedStyles.rowCenteredContainer, localStyles.zeroTopMarginAndMediumBottomOne]}>
                <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder='Title...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[sharedStyles.inputField, localStyles.zeroBottomMarginAndLightRightOne, { flex: 1 }]}
                />
                <TextInput
                    value={newPostDescription}
                    onChangeText={setNewPostDescription}
                    placeholder='Description...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[sharedStyles.inputField, localStyles.zeroBottomMarginAndLightRightOne, { flex: 2 }]}
                />
                <TouchableOpacity onPress={createPost} style={[sharedStyles.button, { width: '20%' }]}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Post</Text>
                </TouchableOpacity>
            </View>

            {/* 634.45 */}
            <View style={[sharedStyles.separatorLine, { bottom: 635 }]} /> 

            {/* List of Posts */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                style={[keyboardHeight > 0 ? sharedStyles.avoidingTabBarContainer: localStyles.mediumMarginBottom, localStyles.mediumTopPadding, { width: '100%' }]}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={localStyles.mediumBottomPadding}/>}
            />

            {/* Separator Line */}
            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight > 0 && Platform.OS === 'android' ? 0 : 90 }]} />
        </View>

    );
};
//keyboardHeight + 90

export default ForumScreen;
