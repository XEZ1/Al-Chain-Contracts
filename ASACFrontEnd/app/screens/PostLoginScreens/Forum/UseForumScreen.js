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

    return { posts, loading, createPost };
};