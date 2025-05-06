from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import JobViewSet, dashboard_stats
from django.conf.urls.static import static
from django.conf import settings


# Create a router for JobViewSet
router = DefaultRouter()
router.register(r'jobs', JobViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin panel
    path('api/jobposting/', include('jobposting.urls')),  # <-- fixed here
    path('api/dashboard/stats/', dashboard_stats, name='dashboard-stats'),  # Dashboard stats endpoint
    path('api/', include(router.urls)),  # Include router URLs from the jobs app
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
