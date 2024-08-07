from rest_framework import serializers as serialisers
from .models import Post, Comment, Like


class CommentSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the Comment model.
    Includes the author's username in the serialised data.
    """
    author_username = serialisers.ReadOnlyField(source='author.username')

    class Meta:
        """
        Meta options for the CommentSerialiser.
        Specifies the model and the fields to include in the serialised data.
        """
        model = Comment
        fields = ['id', 'post', 'author', 'author_username', 'content', 'created_at']


class LikeSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the Like model.
    """
    class Meta:
        """
        Meta options for the LikeSerialiser.
        Specifies the model and the fields to include in the serialised data.
        """
        model = Like
        fields = ['id', 'post', 'user']


class PostSerialiser(serialisers.ModelSerializer):
    """
    Serialiser for the Post model.
    Includes nested comments, the count of likes, and flags indicating if the user has liked the post or is the author.
    """
    comments = CommentSerialiser(many=True, read_only=True)
    like_count = serialisers.ReadOnlyField(source='likes.count')
    user_has_liked = serialisers.SerializerMethodField()
    is_user_author = serialisers.SerializerMethodField()

    class Meta:
        """
        Meta options for the PostSerialiser.
        Specifies the model and the fields to include in the serialised data.
        """
        model = Post
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'author', 'comments', 'like_count', 'user_has_liked', 'is_user_author']
        read_only_fields = ['author']

    def create(self, validated_data):
        """
        Create a new Post instance.

        This method assigns the author from the request context to the validated data before creating the Post.
        @param validated_data: The validated data to use when creating the Post.
        """
        # Assign the author from the context (passed during the save call)
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def get_user_has_liked(self, obj):
        """
        Determine if the authenticated user has liked the post.

        @param obj: The Post instance being serialised.
        @return: True if the authenticated user has liked the post, False otherwise.
        """
        user = self.context['request'].user
        if user.is_authenticated:
            return Like.objects.filter(post=obj, user=user).exists()
        return False

    def get_is_user_author(self, obj):
        """
        Determine if the authenticated user is the author of the post.

        @param obj: The Post instance being serialised.
        @return: True if the authenticated user is the author, False otherwise.
        """
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            return obj.author == request.user
        return False
