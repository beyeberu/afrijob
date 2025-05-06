from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobPost
from jobs.models import Job, EmploymentType, JobCategory, FirebaseUser  # Import FirebaseUser

@receiver(post_save, sender=JobPost)
def create_job_on_approval(sender, instance, created, **kwargs):
    # Only act if status is 'Approved' and not already in jobs
    if instance.status == 'Approved':
        # Check if a Job already exists for this JobPost (optional, if you have a link)
        if not Job.objects.filter(
            job_title=instance.job_title,
            company_name=instance.company_name,
            posted_on=instance.posted_on
        ).exists():
            # Get or create the EmploymentType instance
            employment_type_obj = None
            if instance.employment_type:
                employment_type_obj, _ = EmploymentType.objects.get_or_create(name=instance.employment_type)
            # Get or create the JobCategory instance
            job_category_obj = None
            if instance.job_category:
                job_category_obj, _ = JobCategory.objects.get_or_create(name=instance.job_category)
            # Get or create the FirebaseUser instance
            posted_by_obj = None
            if instance.posted_by:
                posted_by_obj, _ = FirebaseUser.objects.get_or_create(email=instance.posted_by)
            # Handle no_of_employees as integer or None
            no_of_employees = instance.no_of_employees if instance.no_of_employees not in [None, ''] else None
            Job.objects.create(
                job_title=instance.job_title,
                company_name=instance.company_name,
                company_logo=instance.company_logo,
                location=instance.location,
                employment_type=employment_type_obj,  # assign the instance, not the string
                job_category=job_category_obj,  # assign the instance, not the string
                no_of_employees=no_of_employees,
                posted_by=posted_by_obj,  # assign the instance, not the string
                job_description=instance.job_description,
                responsibilities=instance.responsibilities,
                qualifications=instance.qualifications,
                skills=instance.skills,
                salary_and_benefits=instance.salary_and_benefits,
                how_to_apply=instance.how_to_apply,
                encourage_applicants=instance.encourage_applicants,
                min_salary=instance.min_salary,
                max_salary=instance.max_salary,
                phone_no=instance.phone_no,
                email=instance.email,
                website=instance.website,
                posted_on=instance.posted_on,
                expired_date=instance.expired_date,
            )