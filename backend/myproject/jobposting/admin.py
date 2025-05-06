from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import JobPost

# Define a resource class for JobPost
class JobPostResource(resources.ModelResource):
    class Meta:
        model = JobPost

# Use ImportExportModelAdmin to enable both import and export
@admin.register(JobPost)
class JobPostAdmin(ImportExportModelAdmin):
    resource_class = JobPostResource
    list_display = ('job_title', 'company_name', 'location', 'employment_type', 'status')
    list_filter = ('status', 'employment_type', 'job_category')
    search_fields = ('job_title', 'company_name', 'location')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Job Information', {
            'fields': ('job_title', 'company_name', 'company_logo', 'location',
                       'employment_type', 'job_category', 'no_of_employees', 'posted_by')
        }),
        ('Job Details', {
            'fields': ('job_description', 'responsibilities', 'qualifications',
                       'skills', 'salary_and_benefits', 'how_to_apply', 'encourage_applicants')
        }),
        ('Salary Information', {
            'fields': ('min_salary', 'max_salary')
        }),
        ('Contact Information', {
            'fields': ('phone_no', 'email', 'website')
        }),
        ('Dates and Status', {
            'fields': ('posted_on', 'expired_date', 'status')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
