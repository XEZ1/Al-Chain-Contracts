"""ASACBackEnd URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Define the URL patterns for the project
urlpatterns = [
                  # Route for the Django admin interface
                  # Provides access to the admin panel for managing the site
                  path('admin/', admin.site.urls),

                  # Route for the Accounts application
                  # Provides access to the user account management functionality
                  path('', include('Accounts.urls')),

                  # Route for the Notifications application
                  # Provides access to the notifications functionality
                  path('notifications/', include('Notifications.urls')),

                  # Route for the Contracts application
                  # Provides access to the contracts functionality
                  path('contracts/', include('Contracts.urls')),

                  # Route for the Forums application
                  # Provides access to the forums functionality
                  path('forums/', include('Forums.urls')),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Add the static files URL pattern
