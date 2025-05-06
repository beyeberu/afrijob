from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.db import models as db_models
from django.utils import timezone
from django.utils.html import format_html

from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import FirebaseUser, UserProfile, Job, EmploymentType, JobCategory


# --------------------------
# Admin Site Branding
# --------------------------
admin.site.site_header = "Afrijob Admin"
admin.site.site_title = "Job Portal Administration"
admin.site.index_title = "Welcome to Job Portal Admin"



# Optional: use the custom admin site instead of the default
# admin_site = CustomAdminSite(name='custom_admin')

# --------------------------
# Firebase User Admin
# --------------------------
class FirebaseUserAdminForm(forms.ModelForm):
    class Meta:
        model = FirebaseUser
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        firebase_uid = cleaned_data.get('firebase_uid')
        password = cleaned_data.get('password')

        if firebase_uid and password:
            raise forms.ValidationError("Firebase-authenticated users cannot have passwords")
        return cleaned_data


class FirebaseUserAdmin(UserAdmin):
    form = FirebaseUserAdminForm
    list_display = ('email', 'firebase_uid', 'first_name', 'last_name', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'firebase_uid', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

    fieldsets = (
        (None, {'fields': ('email', 'firebase_uid', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'firebase_uid'),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.firebase_uid:
            return ('firebase_uid',) + self.readonly_fields
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        if obj.firebase_uid:
            obj.set_unusable_password()
        super().save_model(request, obj, form, change)


# --------------------------
# User Profile Admin
# --------------------------
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__email', 'phone_number')
    raw_id_fields = ('user',)


# --------------------------
# Job Resource
# --------------------------
class JobResource(resources.ModelResource):
    class Meta:
        model = Job
        import_id_fields = ('id',)
        fields = (
            'id', 'job_title', 'company_name', 'location', 'employment_type__name',
            'job_category__name', 'min_salary', 'max_salary', 'posted_on',
            'expired_date', 'posted_by__email'
        )


# --------------------------
# JobCategory Resource
# --------------------------
class JobCategoryResource(resources.ModelResource):
    class Meta:
        model = JobCategory
        import_id_fields = ('id',)
        fields = ('id', 'name', 'description')


# --------------------------
# Job Form
# --------------------------
class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'
        widgets = {
            'company_logo': forms.ClearableFileInput(attrs={'accept': 'image/*'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        min_salary = cleaned_data.get('min_salary')
        max_salary = cleaned_data.get('max_salary')

        if (min_salary is None) != (max_salary is None):
            raise forms.ValidationError("Please specify both minimum and maximum salary or leave both blank")

        if min_salary and max_salary and max_salary < min_salary:
            raise forms.ValidationError("Maximum salary cannot be less than minimum salary")

        return cleaned_data


# --------------------------
# Status Filter for Job
# --------------------------
class StatusFilter(admin.SimpleListFilter):
    title = 'Job Status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('active', 'Active Jobs'),
            ('expired', 'Expired Jobs'),
            ('upcoming', 'Upcoming Jobs'),
            ('draft', 'Draft Jobs'),
        ]

    def queryset(self, request, queryset):
        today = timezone.now().date()
        if self.value() == 'active':
            return queryset.filter(posted_on__lte=today, expired_date__gte=today)
        elif self.value() == 'expired':
            return queryset.filter(expired_date__lt=today)
        elif self.value() == 'upcoming':
            return queryset.filter(posted_on__gt=today)
        elif self.value() == 'draft':
            return queryset.filter(db_models.Q(posted_on__isnull=True) | db_models.Q(expired_date__isnull=True))
        return queryset


# --------------------------
# Job Admin
# --------------------------
@admin.register(Job)
class JobAdmin(ImportExportModelAdmin):
    resource_class = JobResource
    form = JobForm
    list_display = (
        'job_title', 'company_name', 'no_of_employees', 'display_logo', 'location',
        'employment_type', 'job_category', 'salary_range',
        'posted_on', 'expired_date', 'get_status_colored', 'posted_by'
    )
    list_filter = (StatusFilter, 'job_category', 'employment_type', 'location')
    search_fields = ('job_title', 'company_name', 'location')
    ordering = ('-posted_on',)
    readonly_fields = ('get_status', 'display_logo', 'get_status_colored')
    list_select_related = ('employment_type', 'job_category', 'posted_by')
    raw_id_fields = ('posted_by',)

    fieldsets = (
        ('Job Information', {
            'fields': ('job_title', 'company_name', ('company_logo', 'display_logo'),
                       'location', 'employment_type', 'job_category', 'no_of_employees', 'posted_by')
        }),
        ('Job Details', {
            'fields': ('job_description', 'responsibilities', 'qualifications', 'skills',
                       'salary_and_benefits', 'how_to_apply', 'encourage_applicants')
        }),
        ('Salary Information', {'fields': ('min_salary', 'max_salary')}),
        ('Contact Information', {'fields': ('phone_no', 'email', 'website')}),
        ('Dates', {'fields': ('posted_on', 'expired_date', 'get_status_colored')}),
    )

    def display_logo(self, obj):
        if obj.company_logo:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: contain;" />', obj.company_logo.url)
        return "No logo"
    display_logo.short_description = 'Logo Preview'

    def salary_range(self, obj):
        if obj.min_salary and obj.max_salary:
            return f"${obj.min_salary:,.2f} - ${obj.max_salary:,.2f}"
        return "Not specified"
    salary_range.short_description = 'Salary Range'

    def get_status_colored(self, obj):
        status = obj.get_status()
        colors = {
            'active': 'green',
            'expired': 'red',
            'upcoming': 'orange',
            'draft': 'gray'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(status, 'black'), status.capitalize()
        )
    get_status_colored.short_description = 'Status'


# --------------------------
# Register Other Models
# --------------------------
admin.site.register(FirebaseUser, FirebaseUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(EmploymentType)

@admin.register(JobCategory)
class JobCategoryAdmin(ImportExportModelAdmin):
    resource_class = JobCategoryResource
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


