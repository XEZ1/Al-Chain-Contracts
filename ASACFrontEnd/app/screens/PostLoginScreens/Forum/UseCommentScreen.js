import { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { validateToken } from '../../../components/Authentication';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';


export const useCommentScreen = (postId) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/comments/list/`, {
            headers: {
                'Authorization': `Token ${token}`,
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
            console.log(token);
            console.log(validateToken);
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
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                await fetchComments();
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return { comments, newComment, setNewComment, fetchComments, handleAddComment };
};