from rest_framework.views import APIView
from rest_framework.response import Response
from Notifications.utils import send_push_notification
from .serializers import *
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        posts = Post.objects.all()
        serialiser = PostSerialiser(posts, many=True, context={'request': request})
        return Response(serialiser.data)

    def post(self, request, *args, **kwargs):
        serialiser = PostSerialiser(data=request.data, context={'request': request})
        if serialiser.is_valid():
            serialiser.save(author=request.user)
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, *args, **kwargs):
        post = get_object_or_404(Post, pk=pk)
        serialiser = PostSerialiser(post, context={'request': request})
        return Response(serialiser.data)

    def put(self, request, pk, *args, **kwargs):
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
        post = get_object_or_404(Post, pk=pk)
        if post.author != request.user:
            raise PermissionDenied('You do not have permission to delete this post.')
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, pk, *args, **kwargs):
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
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk, *args, **kwargs):
        comments = Comment.objects.filter(post=pk).order_by('-created_at')
        serialiser = CommentSerialiser(comments, many=True, context={'request': request})
        return Response(serialiser.data)


class LikeCreateDeleteView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, pk, *args, **kwargs):
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
        post = get_object_or_404(Post, pk=pk)
        try:
            like = Like.objects.get(post=post, user=request.user)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            return Response({"detail": "Like not found."}, status=status.HTTP_404_NOT_FOUND)

    def notify_post_owner(self, post, user):
        owner_push_token = post.author.notification_tokens.first()
        print(post.author)
        print(owner_push_token)
        if owner_push_token:
            message_title = "New Like"
            message_body = f"{user.username} liked your post."
            send_push_notification(owner_push_token.token, message_title, message_body)
