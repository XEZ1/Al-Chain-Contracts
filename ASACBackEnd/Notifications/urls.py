from django.urls import path
from .views import SaveTokenView, DeleteTokenView


# Define URL patterns for the notifications application
urlpatterns = [
    # Define the URL pattern for the SaveTokenView
    # This view is used to save a push notification token for a user
    path('save-token/', SaveTokenView.as_view(), name='save-token'),

    # Define the URL pattern for the DeleteTokenView
    # This view is used to delete a push notification token for a user
    path('delete-token/', DeleteTokenView.as_view(), name='delete-token'),
]
