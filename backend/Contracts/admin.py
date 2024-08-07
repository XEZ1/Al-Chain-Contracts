from django.contrib import admin
from .models import SmartContract


# Register the SmartContract model with the Django admin site
# This enables management of SmartContract objects through the admin interface
admin.site.register(SmartContract)

