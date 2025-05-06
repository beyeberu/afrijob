from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import JobViewSet, dashboard_stats

router = DefaultRouter()
router.register(r'jobs', JobViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all routes from the router
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),  # Register the dashboard_stats view
]