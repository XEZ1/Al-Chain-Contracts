from django.contrib import admin
from .models import *

# Register the User model with the admin site
# This allows the admin interface to manage User instances
admin.site.register(User)

# Register the User model with the admin site
# This allows the admin interface to manage AuthenticationPushToken instances
admin.site.register(AuthenticationPushToken)

