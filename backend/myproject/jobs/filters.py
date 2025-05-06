import django_filters
from .models import Job, JobCategory, EmploymentType

class JobFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(
        field_name='job_title', 
        lookup_expr='icontains'
    )
    job_category = django_filters.ModelChoiceFilter(
        field_name='job_category__name',
        queryset=JobCategory.objects.all(),
        to_field_name='name'
    )
    employment_type = django_filters.ModelChoiceFilter(
        field_name='employment_type__name',
        queryset=EmploymentType.objects.all(),
        to_field_name='name'
    )

    class Meta:
        model = Job
        fields = {
            'status': ['exact'],
        }
        order_by = ['-posted_on']