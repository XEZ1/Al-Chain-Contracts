from django.apps import AppConfig


class ForumConfig(AppConfig):
    """
    Configuration class for the Forums application.
    Sets the default primary key field type and the application name.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Forums'
