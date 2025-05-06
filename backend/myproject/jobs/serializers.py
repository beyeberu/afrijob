from rest_framework import serializers
from .models import Job, EmploymentType, JobCategory, FirebaseUser


class DashboardJobSerializer(serializers.ModelSerializer):
    company_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'job_title', 'company_name', 'company_logo_url', 'created_at']

    def get_company_logo_url(self, obj):
        request = self.context.get('request', None)
        if obj.company_logo and request:
            return request.build_absolute_uri(obj.company_logo.url)
        elif obj.company_logo:
            return obj.company_logo.url  # Return relative URL if no request
        return None


class DashboardUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirebaseUser
        fields = ['id', 'email', 'date_joined']


class EmploymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentType
        fields = ['id', 'name', 'description']


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'description']


class FirebaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirebaseUser
        fields = ['id', 'email', 'first_name', 'last_name']


class JobSerializer(serializers.ModelSerializer):
    employment_type = EmploymentTypeSerializer(allow_null=True)
    job_category = JobCategorySerializer(allow_null=True)
    posted_by = FirebaseUserSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    company_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'job_title',
            'company_name',
            'company_logo_url',
            'location',
            'job_description',
            'responsibilities',
            'qualifications',
            'skills',
            'salary_and_benefits',
            'how_to_apply',
            'encourage_applicants',
            'employment_type',
            'min_salary',
            'max_salary',
            'no_of_employees',
            'phone_no',
            'email',
            'website',
            'job_category',
            'posted_by',
            'posted_on',
            'expired_date',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'status']

    def get_status(self, obj):
        try:
            return obj.get_status()
        except Exception as e:
            return f"Error: {str(e)}"

    def get_company_logo_url(self, obj):
        request = self.context.get('request', None)
        if obj.company_logo and request:
            return request.build_absolute_uri(obj.company_logo.url)
        elif obj.company_logo:
            return obj.company_logo.url  # Return relative URL if no request
        return None


class UserSerializer(serializers.ModelSerializer):  # Added UserSerializer
    class Meta:
        model = FirebaseUser
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined']