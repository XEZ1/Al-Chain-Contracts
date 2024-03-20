from rest_framework import serializers
from .models import Post, Comment, Like


class CommentSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']


class LikeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user']


class PostSerialiser(serializers.ModelSerializer):
    comments = CommentSerialiser(many=True, read_only=True)
    like_count = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'author', 'comments', 'like_count']
