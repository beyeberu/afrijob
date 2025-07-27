# serializers.py
from rest_framework import serializers
from .models import JobPost
from django.utils import timezone

class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = '__all__'
        extra_kwargs = {
            'company_logo': {'required': False, 'allow_null': True},
            'location': {'required': False, 'allow_null': True},  # No allow_blank!
            'employment_type': {'required': False, 'allow_blank': True},
            'job_category': {'required': False, 'allow_blank': True},
            'no_of_employees': {'required': False, 'allow_blank': True},
            'posted_by': {'required': False, 'allow_blank': True},
            'job_description': {'required': False, 'allow_blank': True},
            'responsibilities': {'required': False, 'allow_blank': True},
            'qualifications': {'required': False, 'allow_blank': True},
            'skills': {'required': False, 'allow_blank': True},
            'salary_and_benefits': {'required': False, 'allow_blank': True},
            'how_to_apply': {'required': False, 'allow_blank': True},
            'encourage_applicants': {'required': False, 'allow_blank': True},
            'min_salary': {'required': False, 'allow_null': True},
            'max_salary': {'required': False, 'allow_null': True},
            'phone_no': {'required': False, 'allow_blank': True},
            'website': {'required': False, 'allow_blank': True},
            'expired_date': {'required': False, 'allow_null': True},
            'status': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        """Custom validation"""
        min_salary = data.get('min_salary')
        max_salary = data.get('max_salary')
        if min_salary and max_salary and min_salary > max_salary:
            raise serializers.ValidationError({
                'max_salary': 'Maximum salary must be greater than minimum salary.'
            })

        posted_on = data.get('posted_on', timezone.now().date())
        expired_date = data.get('expired_date')
        if expired_date and expired_date < posted_on:
            raise serializers.ValidationError({
                'expired_date': 'Expired date must be after posted date.'
            })
        
        return data