from rest_framework import serializers
from .models import Post, Comment, Like


class CommentSerialiser(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_username', 'content', 'created_at']
        

class LikeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user']


class PostSerialiser(serializers.ModelSerializer):
    comments = CommentSerialiser(many=True, read_only=True)
    like_count = serializers.ReadOnlyField(source='likes.count')
    user_has_liked = serializers.SerializerMethodField()
    is_user_author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'author', 'comments', 'like_count', 'user_has_liked', 'is_user_author']
        read_only_fields = ['author']

    def create(self, validated_data):
        # Assign the author from the context (passed during the save call)
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def get_user_has_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Like.objects.filter(post=obj, user=user).exists()
        return False

    def get_is_user_author(self, obj):
        # self.context['request'] will be your current request object
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            return obj.author == request.user
        return False