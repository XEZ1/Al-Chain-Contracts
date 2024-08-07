import { useState, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import { validateToken } from '../../../components/Authentication';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';


/**
 * Custom hook for managing the comment screen.
 * 
 * @param {number} postId - The ID of the post to fetch comments for.
 * @returns {object} - The comments, new comment state, and handler functions.
 */
export const useCommentScreen = (postId) => {
    // Fields to store the comments and new comment state
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    /**
     * Fetch comments when the component mounts
     */
    useEffect(() => {
        fetchComments();
    }, []);

    /**
     * Fetch comments for the specified post.
     * 
     * @async
     * @function fetchComments
     * @throws Will log an error if the comments cannot be fetched.
     */
    const fetchComments = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/comments/list/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        };
    };

    /**
     * Handle adding a new comment to the specified post.
     * 
     * @async
     * @function handleAddComment
     * @param {string} commentText - The text of the comment to add.
     * @throws Will log an error if the comment cannot be added.
     */
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