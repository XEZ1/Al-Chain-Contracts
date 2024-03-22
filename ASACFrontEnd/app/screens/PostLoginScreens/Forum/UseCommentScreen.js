export const UseCommentScreen = () => {

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
    
    const handleAddComment = async () => {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${BACKEND_URL}/forums/posts/${postId}/comments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newComment }),
        });
        if (response.ok) {
            setNewComment('');
            fetchComments(); // Refresh comments to show the new one
        }
    };

};