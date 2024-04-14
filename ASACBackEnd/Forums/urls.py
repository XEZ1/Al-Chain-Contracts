from django.urls import path
from .views import PostListCreateView, PostDetailView, CommentCreateView, CommentListView, LikeCreateDeleteView


urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/comments/', CommentCreateView.as_view(), name='comment-create'),
    path('posts/<int:pk>/comments/list/', CommentListView.as_view(), name='comment-list'),
    path('posts/<int:pk>/like/', LikeCreateDeleteView.as_view(), name='like-create-delete'),
]
