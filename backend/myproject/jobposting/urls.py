# urls.py
from django.urls import path
from .views import JobPostCreateView, get_csrf_token

urlpatterns = [
    path('posts/', JobPostCreateView.as_view(), name='jobpost-create'),
    path('csrf_token/', get_csrf_token, name='csrf-token'),
]