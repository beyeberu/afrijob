from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobPost
from jobs.models import Job, EmploymentType, JobCategory, FirebaseUser  # Adjust import path if needed

@receiver(post_save, sender=JobPost)
def create_job_on_approval(sender, instance, created, **kwargs):
    if instance.approved and not instance.job_created:
        # EmploymentType (FK or None)
        employment_type_obj = None
        if instance.employment_type:
            employment_type_obj, _ = EmploymentType.objects.get_or_create(name=instance.employment_type)

        # JobCategory (FK or None)
        job_category_obj = None
        if instance.job_category:
            job_category_obj, _ = JobCategory.objects.get_or_create(name=instance.job_category)

        # Try to get the FirebaseUser instance
        posted_by_user = None
        if instance.posted_by:
            try:
                posted_by_user = FirebaseUser.objects.get(email=instance.posted_by)
            except FirebaseUser.DoesNotExist:
                posted_by_user = None  # Or handle as needed

        # Create Job in jobs app
        Job.objects.create(
            job_title=instance.job_title,
            company_name=instance.company_name,
            company_logo=instance.company_logo,
            location=instance.location,
            job_description=instance.job_description,
            responsibilities=instance.responsibilities,
            qualifications=instance.qualifications,
            skills=instance.skills,
            salary_and_benefits=instance.salary_and_benefits,
            how_to_apply=instance.how_to_apply,
            encourage_applicants=instance.encourage_applicants,
            employment_type=employment_type_obj,
            min_salary=instance.min_salary,
            max_salary=instance.max_salary,
            no_of_employees=instance.no_of_employees,
            phone_no=instance.phone_no,
            email=instance.email,
            website=instance.website,
            job_category=job_category_obj,
            posted_by=posted_by_user,  # Must be a FirebaseUser instance or None
            posted_on=instance.posted_on,
            expired_date=instance.expired_date,
        )

        instance.job_created = True
        instance.save(update_fields=['job_created'])