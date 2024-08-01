import { createContext, useContext, useState, useEffect } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';

// Create a context to manage the forum screen
const PostContext = createContext();

/**
 * Custom hook to use the ForumScreen context.
 * @returns {object} - The context values provided by PostProvider.
 */
export const useForumScreen = () => useContext(PostContext);

/**
 * Provider component to manage forum posts and actions related to them.
 * @param {object} children - The child components to be wrapped by this provider.
 * @returns {JSX.Element} - The PostContext provider with the relevant values and functions.
 */
export const PostProvider = ({ children }) => {
    // States to store posts, load status, and new post details
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDescription, setNewPostDescription] = useState('');

    /**
     * Fetch posts when the component mounts.
     */
    useEffect(() => {
        fetchPosts();
    }, []);

    /**
     * Fetch posts from the backend.
     * @async
     * @function fetchPosts
     * @throws Will log an error if the posts cannot be fetched.
     */
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const sortedData = data.sort((a, b) => b.like_count - a.like_count);
            // Update the posts state with the fetched data
            setPosts(sortedData);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new post.
     * @async
     * @function createPost
     * @throws Will log an error if the post cannot be created.
     */
    const createPost = async () => {
        try {
            if (!newPostTitle.trim() || !newPostDescription.trim()) {
                Alert.alert('Error', 'Title and description cannot be empty.');
                return;
            }
            title = newPostTitle; 
            description = newPostDescription;
            // Clear the states
            setNewPostTitle('');
            setNewPostDescription('');

            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                // Send the post data in the request body
                body: JSON.stringify({ title, description }), 
            });
            if (response.ok) {
                const newPost = await response.json();
                // Animate the layout change
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                // Add the new post to the list
                setPosts(currentPosts => [newPost, ...currentPosts]);
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    /**
     * Handle liking or unliking a post.
     * @async
     * @function handleLikePost
     * @param {number} postId - The ID of the post to like or unlike.
     * @param {boolean} userHasLiked - Whether the user has already liked the post.
     * @throws Will log an error if the post cannot be liked or unliked.
     */
    const handleLikePost = async (postId, userHasLiked) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === postId ? { ...post, user_has_liked: !userHasLiked, like_count: post.like_count + (userHasLiked ? -1 : 1) } : post
            )
        );

        try {
            const token = await SecureStore.getItemAsync('authToken');
            const method = userHasLiked ? 'DELETE' : 'POST';
            const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/like/`, {
                method: method,
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            if (!response.ok) {
                setPosts(currentPosts =>
                    currentPosts.map(post =>
                        post.id === postId ? { ...post, user_has_liked: userHasLiked, like_count: post.like_count - (userHasLiked ? -1 : 1) } : post
                    )
                );
                console.error('Failed to like post');
            } else {
                console.log('success');
            }
        } catch (error) {
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === postId ? { ...post, user_has_liked: userHasLiked, like_count: post.like_count - (userHasLiked ? -1 : 1) } : post
                )
            );
            console.error('Failed to like post:', error);
        }
    };

    /**
     * Handle deleting a post.
     * @async
     * @function handleDeletePost
     * @param {number} postId - The ID of the post to delete.
     * @throws Will log an error if the post cannot be deleted.
     */
    const handleDeletePost = async (postId) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                console.log("Post deleted successfully");
                // Animate the layout change
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); 
                // Remove the deleted post from the list
                setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    return (
        <PostContext.Provider value={{ posts, loading, createPost, handleLikePost, handleDeletePost, newPostTitle, setNewPostTitle, newPostDescription, setNewPostDescription }}>
            {children}
        </PostContext.Provider>
    );
};