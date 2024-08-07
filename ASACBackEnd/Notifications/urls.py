from django.urls import path
from .views import SaveTokenView, DeleteTokenView, GetTokenView


# Define URL patterns for the notifications application
urlpatterns = [
    # Define the URL pattern for the SaveTokenView
    # This view is used to save a push notification token for a user
    path('save-token/', SaveTokenView.as_view(), name='save-token'),

    # Define the URL pattern for the DeleteTokenView
    # This view is used to delete a push notification token for a user
    path('delete-token/', DeleteTokenView.as_view(), name='delete-token'),

    # Define the URL pattern for the GetTokenView
    # This view is used to get a push notification token for a user
    path('get-token/', GetTokenView.as_view(), name='get-token')
]
