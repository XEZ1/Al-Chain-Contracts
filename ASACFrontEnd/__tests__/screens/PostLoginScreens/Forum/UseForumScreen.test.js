import { renderHook, act } from '@testing-library/react-hooks';
import { Alert, LayoutAnimation } from 'react-native';
import { PostProvider } from '../../../../app/screens/PostLoginScreens/Forum/UseForumScreen';
import { useForumScreen } from '../../../../app/screens/PostLoginScreens/Forum/UseForumScreen';
import * as SecureStore from 'expo-secure-store';


jest.mock('expo-secure-store');

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
    configureNext: jest.fn(),
}));

global.fetch = jest.fn();

describe('UseForumScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockReset();
        fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
    });

    const wrapper = ({ children }) => (
        <PostProvider>{children}</PostProvider>
    );

    it('initially fetches posts and sorts them by likes', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, like_count: 10 }, 
                    { id: 2, like_count: 20 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        expect(result.current.posts).toEqual([{ id: 2, like_count: 20 }, { id: 1, like_count: 10 }]);
        expect(result.current.loading).toBe(false);
    });

    it('correctly handles errors on posts fetching', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error'))); 

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        expect(result.current.posts).toEqual([]);
        expect(console.error).toHaveBeenCalledWith('Failed to fetch posts:', new Error('Network Error'));
    
        consoleErrorSpy.mockRestore();
    });
    
    it('creates a post successfully and updates the post list', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 3, title: 'New Post', description: 'Description', like_count: 0 }
                ]),
            })
        );
    
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();
        
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 3, title: 'New Post', description: 'Description', like_count: 0 }
                ]),
            })
        );
        
        act(() => {
            result.current.setNewPostTitle('New Post');
            result.current.setNewPostDescription('Description');
        });
        
        await act(async () => {
            await result.current.createPost();
        });
    
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(result.current.posts[0]).toEqual([{ id: 3, title: 'New Post', description: 'Description', like_count: 0 }]);
        expect(LayoutAnimation.configureNext).toHaveBeenCalledWith(LayoutAnimation.Presets.spring);
    });
    
    it('alerts error when trying to create a post with empty title or description', async () => {
        const spyAlert = jest.spyOn(Alert, 'alert');
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        act(() => {
            result.current.createPost();
        });

        expect(spyAlert).toHaveBeenCalledWith('Error', 'Title and description cannot be empty.');
    });

    it('handles errors in post creation', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, user_has_liked: true, like_count: 2 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            })
        ); // the second call for the handle like post

        act(() => {
            result.current.setNewPostTitle('New Post');
            result.current.setNewPostDescription('Description');
        });

        await act(async () => {
            await result.current.createPost();
        });

        expect(result.current.posts[0].like_count).toBe(2);
        expect(result.current.posts[0].user_has_liked).toBe(true);
        expect(console.error).toHaveBeenCalledWith('Failed to create post');
    });

    it('handles exceptions thrown during fetch on post creation', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 }
                ]),
            })
        );
      
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        act(() => {
            result.current.setNewPostTitle('New Post');
            result.current.setNewPostDescription('Description');
        });

        await act(async () => {
            await result.current.createPost();
        });

        expect(result.current.posts).toEqual([{ id: 1, title: 'First Post', like_count: 10 }]);
        expect(console.error).toHaveBeenCalledWith('Failed to create post:', new Error('Network Error'));
    
        consoleErrorSpy.mockRestore();
    });

    it('likes a post correctly and updates the like state', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, user_has_liked: false, like_count: 1 },
                    { id: 2, user_has_liked: false, like_count: 1 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();
        
        await act(async () => {
            await result.current.handleLikePost(1, false);
        });

        expect(result.current.posts[0].like_count).toBe(2);
        expect(result.current.posts[0].user_has_liked).toBe(true);

        consoleLogSpy.mockRestore();
    });

    it('handles errors in liking a post correctly', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, user_has_liked: false, like_count: 2 },
                    { id: 2, user_has_liked: false, like_count: 2 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            })
        ); // the second call for the handle like post

        await act(async () => {
            await result.current.handleLikePost(1, false);
        });

        expect(result.current.posts[0].like_count).toBe(2);
        expect(result.current.posts[0].user_has_liked).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Failed to like post');
       
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('handles exceptions thrown during fetch on post liking', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 },
                    { id: 2, title: 'Second Post', like_count: 10 }
                ]),
            })
        );
      
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        await act(async () => {
            await result.current.handleLikePost(1, false);
        });

        expect(result.current.posts).toEqual([{ id: 1, title: 'First Post', like_count: 10, user_has_liked: false}, { id: 2, title: 'Second Post', like_count: 10 }]);
        expect(console.error).toHaveBeenCalledWith('Failed to like post:', new Error('Network Error'));
    
        consoleErrorSpy.mockRestore();
    });

    it('deletes like correctly and updates the state', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, user_has_liked: true, like_count: 1 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        await act(async () => {
            await result.current.handleLikePost(1, true);
        });

        expect(result.current.posts[0].like_count).toBe(0);
        expect(result.current.posts[0].user_has_liked).toBe(false);

        consoleLogSpy.mockRestore();
    });

    it('handles errors in deleting a like correctly', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, user_has_liked: true, like_count: 2 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            })
        ); // the second call for the handle like post

        await act(async () => {
            await result.current.handleLikePost(1, true);
        });

        expect(result.current.posts[0].like_count).toBe(2);
        expect(result.current.posts[0].user_has_liked).toBe(true);
        expect(console.error).toHaveBeenCalledWith('Failed to like post');
       
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('handles exceptions thrown during fetch on deletion on post liking', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 }
                ]),
            })
        );
      
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        await act(async () => {
            await result.current.handleLikePost(1, true);
        });

        expect(result.current.posts).toEqual([{ id: 1, title: 'First Post', like_count: 10, user_has_liked: true}]);
        expect(console.error).toHaveBeenCalledWith('Failed to like post:', new Error('Network Error'));
    
        consoleErrorSpy.mockRestore();
    });




    it('successfully deletes a post and updates the posts list', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 },
                    { id: 2, title: 'Second Post', like_count: 5 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 204,
            })
        );

        await act(async () => {
            await result.current.handleDeletePost(1);
        });

        expect(result.current.posts).toEqual([{ id: 2, title: 'Second Post', like_count: 5 }]);
        expect(LayoutAnimation.configureNext).toHaveBeenCalledWith(LayoutAnimation.Presets.spring);
    
        consoleLogSpy.mockRestore();
    });

    it('handles failed deletion due to API error', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 }
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 400,
            })
        );

        await act(async () => {
            await result.current.handleDeletePost(1);
        });

        expect(result.current.posts).toEqual([{ id: 1, title: 'First Post', like_count: 10 }]);
        expect(console.error).toHaveBeenCalledWith('Failed to delete post');
    });

    it('handles exceptions thrown during fetch on handledeletecontract', async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { id: 1, title: 'First Post', like_count: 10 }
                ]),
            })
        );
      
        const { result, waitForNextUpdate } = renderHook(() => useForumScreen(), { wrapper });
        await waitForNextUpdate();

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        await act(async () => {
            await result.current.handleDeletePost(1);
        });

        expect(result.current.posts).toEqual([{ id: 1, title: 'First Post', like_count: 10 }]);
        expect(console.error).toHaveBeenCalledWith('Failed to delete post:', new Error('Network Error'));
    
        consoleErrorSpy.mockRestore();
    });


});





describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
