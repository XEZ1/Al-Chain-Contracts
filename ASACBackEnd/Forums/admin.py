from django.contrib import admin
from .models import Post, Comment, Like


# Register the Post, Comment, and Like models with the admin site
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)

