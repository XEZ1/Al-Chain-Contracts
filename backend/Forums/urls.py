from django.urls import path
from .views import PostListCreateView, PostDetailView, CommentCreateView, CommentListView, LikeCreateDeleteView

# Define URL patterns for the forums application
urlpatterns = [
    # Define the URL pattern for the PostListCreateView
    # This view is used to list all posts and create a new post
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),

    # Define the URL pattern for the PostDetailView
    # This view is used to retrieve, update, or delete a specific post
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),

    # Define the URL pattern for the CommentCreateView
    # This view is used to create a new comment on a specific post
    path('posts/<int:pk>/comments/', CommentCreateView.as_view(), name='comment-create'),

    # Define the URL pattern for the CommentListView
    # This view is used to list all comments on a specific post
    path('posts/<int:pk>/comments/list/', CommentListView.as_view(), name='comment-list'),

    # Define the URL pattern for the LikeCreateDeleteView
    # This view is used to create or delete a like on a specific post
    path('posts/<int:pk>/like/', LikeCreateDeleteView.as_view(), name='like-create-delete'),
]
