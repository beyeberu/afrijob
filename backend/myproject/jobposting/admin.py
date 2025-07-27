from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from django.utils.html import format_html
from django.utils.timesince import timesince
from .models import JobPost
from django import forms

class JobPostResource(resources.ModelResource):
    class Meta:
        model = JobPost

class JobPostAdminForm(forms.ModelForm):
    class Meta:
        model = JobPost
        fields = "__all__"

    location = forms.CharField()  # Always use a text input

@admin.register(JobPost)
class JobPostAdmin(ImportExportModelAdmin):
    form = JobPostAdminForm
    resource_class = JobPostResource
    list_display = (
        'job_title', 'company_name', 'location', 'employment_type', 'status', 'approved', 'job_created', 'new_for_admin'
    )
    list_filter = ('status', 'employment_type', 'job_category', 'approved')
    search_fields = ('job_title', 'company_name', 'location')
    readonly_fields = ('created_at', 'updated_at')

    def new_for_admin(self, obj):
        if not obj.approved:
            return format_html(
                '<span style="color:green;font-weight:bold;">🟢 NEW</span><br><small>{} ago</small>',
                timesince(obj.created_at)
            )
        else:
            return ""
    new_for_admin.short_description = "New?"

    actions = ['approve_jobs']

    def approve_jobs(self, request, queryset):
        count = 0
        for obj in queryset:
            if not obj.approved or obj.status != 'active':
                obj.approved = True
                obj.status = 'active'  # Or your published status
                obj.save()  # This triggers the post_save signal!
                count += 1
        self.message_user(request, f"{count} job(s) successfully approved and activated.")
    approve_jobs.short_description = "Approve selected jobs"
