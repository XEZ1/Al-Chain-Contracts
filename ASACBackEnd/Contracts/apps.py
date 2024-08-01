from django.apps import AppConfig


class ContractsConfig(AppConfig):
    """
    Configuration class for the Contracts application.
    Sets default auto field type and application name.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Contracts'
