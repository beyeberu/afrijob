from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import JobViewSet, dashboard_stats
from .views import AdvertisementListView, LocationListCreateView

router = DefaultRouter()
router.register(r'jobs', JobViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all routes from the router
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),  # Register the dashboard_stats view
    path('advertisements/', AdvertisementListView.as_view(), name='advertisement-list'),
    path('locations/', LocationListCreateView.as_view(), name='location-list-create'),
]