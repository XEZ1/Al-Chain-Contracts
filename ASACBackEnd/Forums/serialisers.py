from rest_framework import serializers as serialisers
from .models import Post, Comment, Like


class CommentSerialiser(serialisers.ModelSerializer):
    author_username = serialisers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_username', 'content', 'created_at']


class LikeSerialiser(serialisers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user']


class PostSerialiser(serialisers.ModelSerializer):
    comments = CommentSerialiser(many=True, read_only=True)
    like_count = serialisers.ReadOnlyField(source='likes.count')
    user_has_liked = serialisers.SerializerMethodField()
    is_user_author = serialisers.SerializerMethodField()

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
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            return obj.author == request.user
        return False
