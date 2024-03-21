import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';


export const useForumScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

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
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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
            console.log(response);
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
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const method = userHasLiked ? 'DELETE' : 'POST';
            const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/like/`, {
                method: method,
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
    
            if (response.ok) {
                console.log(userHasLiked ? "Post unliked successfully" : "Post liked successfully");
                await fetchPosts(); 
            } else {
                console.error('Failed to like post');
            }
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };
    
    const handleAddComment = async (postId, commentText) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/comments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: commentText }),
            });
    
            if (response.ok) {
                // Optionally refresh the post to show the new comment
                console.log("Comment added successfully");
                await fetchPosts(); // Refresh posts to include new comments
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };
    

    return { posts, loading, createPost, handleLikePost, handleAddComment };
};