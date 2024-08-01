from rest_framework.views import APIView
from rest_framework.response import Response
from Notifications.utils import send_push_notification
from .serialisers import *
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied


class PostListCreateView(APIView):
    """
    View to list all posts and create a new post.
    Allows read-only access for unauthenticated users and full access for authenticated users.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        """
        Retrieve a list of all posts.

        @param request: The request object.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for all posts.
        """
        posts = Post.objects.all()
        serialiser = PostSerialiser(posts, many=True, context={'request': request})
        return Response(serialiser.data)

    def post(self, request, *args, **kwargs):
        """
        Create a new post.

        @param request: The request object.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for the new post.
        """
        serialiser = PostSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save(author=request.user)
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    """
    View to retrieve, update, or delete a specific post.
    Allows read-only access for unauthenticated users and full access for authenticated users.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, *args, **kwargs):
        """
        Retrieve a specific post by its primary key (pk).

        @param request: The request object.
        @param pk: The primary key of the post to retrieve.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for the post.
        """
        post = get_object_or_404(Post, pk=pk)
        serialiser = PostSerialiser(post, context={'request': request})
        return Response(serialiser.data)

    def put(self, request, pk, *args, **kwargs):
        """
        Update a specific post.
        Only the author of the post is allowed to update it.

        @param request: The request object.
        @param pk: The primary key of the post to update.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for the updated post.
        """
        post = get_object_or_404(Post, pk=pk)
        if post.author != request.user:
            return Response({'detail': 'You do not have permission to edit this post.'},
                            status=status.HTTP_403_FORBIDDEN)
        serialiser = PostSerialiser(post, data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        """
        Delete a specific post.
        Only the author of the post is allowed to delete it.

        @param request: The request object.
        @param pk: The primary key of the post to delete.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response with a 204 status code.
        """
        post = get_object_or_404(Post, pk=pk)
        if post.author != request.user:
            raise PermissionDenied('You do not have permission to delete this post.')
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentCreateView(APIView):
    """
    View to create a new comment on a specific post.
    Allows read-only access for unauthenticated users and full access for authenticated users.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, pk, *args, **kwargs):
        """
        Create a new comment for a specific post.

        @param request: The request object.
        @param pk: The primary key of the post to comment on.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for the new comment.
        """
        # Make a mutable copy of the data
        data = request.data.copy()
        data['post'] = pk
        data['author'] = request.user.id
        serialiser = CommentSerialiser(data=data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentListView(APIView):
    """
    View to list all comments for a specific post.
    Allows read-only access for unauthenticated users and full access for authenticated users.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, *args, **kwargs):
        """
        Retrieve a list of all comments for a specific post.

        @param request: The request object.
        @param pk: The primary key of the post to retrieve comments for.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for all comments on the post.
        """
        comments = Comment.objects.filter(post=pk).order_by('-created_at')
        serialiser = CommentSerialiser(comments, many=True, context={'request': request})
        return Response(serialiser.data)


class LikeCreateDeleteView(APIView):
    """
    View to like or unlike a specific post.
    Allows read-only access for unauthenticated users and full access for authenticated users.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, pk, *args, **kwargs):
        """
        Like a specific post.
        If the post is already liked by the user, unlike it.

        @param request: The request object.
        @param pk: The primary key of the post to like.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response containing the serialised data for the like.
        """
        post = get_object_or_404(Post, pk=pk)
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if created:
            serialiser = LikeSerialiser(like)
            self.notify_post_owner(post, request.user)
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk, *args, **kwargs):
        """
        Unlike a specific post.

        @param request: The request object.
        @param pk: The primary key of the post to unlike.
        @param args: Additional positional arguments.
        @param kwargs: Additional keyword arguments.
        @return: A response with a status code.
        """
        post = get_object_or_404(Post, pk=pk)
        try:
            like = Like.objects.get(post=post, user=request.user)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            return Response({"detail": "Like not found."}, status=status.HTTP_404_NOT_FOUND)

    def notify_post_owner(self, post, user):
        """
        Send a notification to the owner of a post that it has been liked.

        @param post: The post that was liked.
        @param user: The user who liked the post.
        """
        owner_push_token = post.author.notification_tokens.first()
        print(post.author)
        print(owner_push_token)
        if owner_push_token:
            message_title = "New Like"
            message_body = f"{user.username} liked your post."
            send_push_notification(owner_push_token.token, message_title, message_body)
