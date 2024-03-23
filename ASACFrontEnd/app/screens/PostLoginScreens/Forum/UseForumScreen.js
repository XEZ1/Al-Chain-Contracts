import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';


export const useForumScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

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
            setPosts(sortedData);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (title, description) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });
            if (response.ok) {
                const newPost = await response.json();
                setPosts(currentPosts => [newPost, ...currentPosts]);
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

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
            console.error('Failed to like post:', error);
        }
    };

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
                await fetchPosts(); // Refresh the posts to reflect the deletion
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    return { posts, loading, createPost, handleLikePost, handleDeletePost, fetchPosts };
};