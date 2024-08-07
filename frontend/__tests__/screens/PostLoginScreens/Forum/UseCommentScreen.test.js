import { renderHook, act } from '@testing-library/react-hooks';
import { useCommentScreen } from '../../../../app/screens/PostLoginScreens/Forum/UseCommentScreen';
import * as SecureStore from 'expo-secure-store';
import { LayoutAnimation } from 'react-native';


jest.mock('expo-secure-store');

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation');

global.fetch = jest.fn();

describe('useCommentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        SecureStore.getItemAsync.mockResolvedValue('authToken');
        fetch.mockReset();
    });

    it('fetches comments successfully', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { "author": 3, "author_username": "Me", "content": "Alike", "created_at": "2024-04-14T22:08:08.744797Z", "id": 1, "post": 1 },
                    { "author": 3, "author_username": "Lol333", "content": "Cool", "created_at": "2024-04-14T22:08:04.842586Z", "id": 2, "post": 1 },
                ]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useCommentScreen(1));
        await waitForNextUpdate();

        expect(result.current.comments).toEqual([
            { "author": 3, "author_username": "Me", "content": "Alike", "created_at": "2024-04-14T22:08:08.744797Z", "id": 1, "post": 1 },
            { "author": 3, "author_username": "Lol333", "content": "Cool", "created_at": "2024-04-14T22:08:04.842586Z", "id": 2, "post": 1 },
        ]);
        expect(fetch).toHaveBeenCalledWith(`https://example.com/forums/posts/1/comments/list/`, {
            headers: { 'Authorization': 'Token authToken' },
        });
    });

    //it('handles failed comment fetch due to an API error', async () => {
    //    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
//
    //    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
//
    //    const { result, waitForNextUpdate } = renderHook(() => useCommentScreen());
    //    await waitForNextUpdate();
//
    //    expect(result.current.comments).toEqual([]);
    //    expect(console.error).toHaveBeenCalledWith('Failed to fetch comments', expect.any(Error));
//
    //    consoleErrorSpy.mockRestore();
    //});
    
    it('adds a comment successfully', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { "author": 3, "author_username": "Me", "content": "Alike", "created_at": "2024-04-14T22:08:08.744797Z", "id": 1, "post": 1 },
                    { "author": 3, "author_username": "Lol333", "content": "Cool", "created_at": "2024-04-14T22:08:04.842586Z", "id": 2, "post": 1 },
                ]),
            })
        );
    
        const { result, waitForNextUpdate } = renderHook(() => useCommentScreen(1));

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
            })
        );

        await act(async () => {
            await result.current.handleAddComment("New Comment");
        });
    
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(LayoutAnimation.configureNext).toHaveBeenCalled();

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    
    it('handles failed comment add due to an API error', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { "author": 3, "author_username": "Me", "content": "Alike", "created_at": "2024-04-14T22:08:08.744797Z", "id": 1, "post": 1 },
                    { "author": 3, "author_username": "Lol333", "content": "Cool", "created_at": "2024-04-14T22:08:04.842586Z", "id": 2, "post": 1 },
                ]),
            })
        );

        const { result } = renderHook(() => useCommentScreen(1));

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 400,
            })
        );

        await act(async () => {
            await result.current.handleAddComment("New Comment");
        });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledWith('Failed to add comment');

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    })

    it('handles failed comment add due to an exception', async () => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve([
                    { "author": 3, "author_username": "Me", "content": "Alike", "created_at": "2024-04-14T22:08:08.744797Z", "id": 1, "post": 1 },
                    { "author": 3, "author_username": "Lol333", "content": "Cool", "created_at": "2024-04-14T22:08:04.842586Z", "id": 2, "post": 1 },
                ]),
            })
        );

        const { result } = renderHook(() => useCommentScreen(1));

        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));

        await act(async () => {
            await result.current.handleAddComment("New Comment");
        });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledWith('Failed to add comment:', expect.any(Error));

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
