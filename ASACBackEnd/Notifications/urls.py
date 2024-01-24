from django.urls import path
from .views import SaveTokenView, DeleteTokenView


urlpatterns = [
    path('save-token/', SaveTokenView.as_view(), name='save-token'),
    path('delete-token/', DeleteTokenView.as_view(), name='delete-token'),
]
