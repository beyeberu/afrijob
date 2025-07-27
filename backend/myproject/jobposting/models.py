# models.py
from django.db import models
from django.utils import timezone

class JobPost(models.Model):
    EMPLOYMENT_TYPES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Temporary', 'Temporary'),
        ('Internship', 'Internship'),
        ('Volunteer', 'Volunteer'),
    ]
    
    JOB_CATEGORIES = [
        ('Architecture & Construction', 'Architecture & Construction'),
        ('Construction', 'Construction'),
        ('Engineering', 'Engineering'),
        ('Accounting', 'Accounting'),
        ('Finance', 'Finance'),
        ('Customer Service', 'Customer Service'),
        ('Professional Services', 'Professional Services'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Information Technology', 'Information Technology'),
        ('Telecommunications', 'Telecommunications'),
        ('Community Service', 'Community Service'),
        ('Science & Technology', 'Science & Technology'),
        ('Business & Administration', 'Business & Administration'),
        ('Media & Journalism', 'Media & Journalism'),
        ('Advertising and Media', 'Advertising and Media'),
        ('Sales', 'Sales'),
        ('Management', 'Management'),
        ('Admin, Secretarial & Clerical', 'Admin, Secretarial & Clerical'),
        ('Legal', 'Legal'),
        ('Restaurant & Food Service', 'Restaurant & Food Service'),
        ('Purchasing & Procurement', 'Purchasing & Procurement'),
        ('Business Development', 'Business Development'),
        ('QA-Quality Control', 'QA-Quality Control'),
        ('Inventory & Stock', 'Inventory & Stock'),
        ('Insurance', 'Insurance'),
        ('Economics', 'Economics'),
        ('Social Science & Community', 'Social Science & Community'),
        ('Communications, PR & Journalism', 'Communications, PR & Journalism'),
        ('Environment & Natural Resource', 'Environment & Natural Resource'),
        ('Hospitality-Hotel', 'Hospitality-Hotel'),
        ('Supply Chain', 'Supply Chain'),
        ('Warehouse', 'Warehouse'),
        ('Natural Science', 'Natural Science'),
        ('Retail and Trade', 'Retail and Trade'),
        ('Nurse', 'Nurse'),
        ('Logistics, Transport & Supply Chain', 'Logistics, Transport & Supply Chain'),
        ('Human Resources', 'Human Resources'),
        ('Development & Project Management', 'Development & Project Management'),
        ('Training', 'Training'),
        ('Installation & Repair', 'Installation & Repair'),
        ('Education', 'Education'),
        ('Health Care', 'Health Care'),
        ('Agriculture and Food', 'Agriculture and Food'),
        ('General Business', 'General Business'),
        ('Research', 'Research'),
        ('Consultancy & Training', 'Consultancy & Training'),
        ('Travel & Tourism', 'Travel & Tourism'),
        ('Manufacturing', 'Manufacturing'),
        ('Maintenance', 'Maintenance'),
        ('Distribution-Shipping', 'Distribution-Shipping'),
    ]
    
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
        ('Approved', 'Approved'),
        ('Expired', 'Expired'),
    ]

    # Job Information
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='job_postings/logos/', null=True, blank=True)
    location = models.CharField(max_length=255)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, blank=True)
    job_category = models.CharField(max_length=50, choices=JOB_CATEGORIES, blank=True)
    no_of_employees = models.CharField(max_length=100, blank=True)
    posted_by = models.CharField(max_length=200, blank=True)

    # Job Details
    job_description = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    salary_and_benefits = models.TextField(blank=True)
    how_to_apply = models.TextField(blank=True)
    encourage_applicants = models.TextField(blank=True)

    # Salary Info
    min_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Contact Info
    phone_no = models.CharField(max_length=20, blank=True)
    email = models.EmailField()
    website = models.URLField(blank=True)

    # Dates
    posted_on = models.DateField(default=timezone.now)
    expired_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Draft')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved = models.BooleanField(default=False)
    job_created = models.BooleanField(default=False)  # ✅ This is new
    is_new_for_admin = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

    class Meta:
        ordering = ['approved', '-created_at']
        verbose_name = 'Job Post'
        verbose_name_plural = 'Job Posts'