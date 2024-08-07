from django.apps import AppConfig


# Define the configuration class for the Accounts application
class AccountsConfig(AppConfig):
    # Specify the default type for auto-generated primary keys in the database
    default_auto_field = 'django.db.models.BigAutoField'

    # Set the name of the application, which is used by Django to refer to this app
    name = 'Accounts'
