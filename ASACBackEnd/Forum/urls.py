from django.urls import path
from .views import PostListCreate, PostDetail, CommentCreate, LikeCreateDelete

urlpatterns = [
    path('posts/', PostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:pk>/comments/', CommentCreate.as_view(), name='comment-create'),
    path('posts/<int:pk>/like/', LikeCreateDelete.as_view(), name='like-create-delete'),
]
