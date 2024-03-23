import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';


export const UseCommentScreen = (postId) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/comments/list/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setComments(data);
        }
    };
    
    const handleAddComment = async (commentText) => {
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
                console.log("Comment added successfully");
                await fetchPosts();
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return { comments, newComment, setNewComment, fetchComments, handleAddComment };
};