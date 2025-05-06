# jobs/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import FirebaseUser, UserProfile

@receiver(post_save, sender=FirebaseUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=FirebaseUser)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()