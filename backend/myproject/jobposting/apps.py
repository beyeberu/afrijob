from django.apps import AppConfig

class JobpostingConfig(AppConfig):
    name = 'jobposting'

    def ready(self):
        import jobposting.signals
