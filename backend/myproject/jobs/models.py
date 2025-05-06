from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify


# --------------------------
# Firebase User Manager
# --------------------------
class FirebaseUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# --------------------------
# Firebase User Model
# --------------------------
class FirebaseUser(AbstractUser):
    username = None  # Remove the default username field
    email = models.EmailField(_('email address'), unique=True)
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = FirebaseUserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Ensure Firebase-authenticated users cannot have passwords
        if self.firebase_uid and self.password:
            self.set_unusable_password()
        super().save(*args, **kwargs)


# --------------------------
# User Profile Model
# --------------------------
class UserProfile(models.Model):
    user = models.OneToOneField(FirebaseUser, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)

    def __str__(self):
        return f"Profile for {self.user.email}"


# --------------------------
# Job Category Model
# --------------------------
# --------------------------
# Job Category Model
# --------------------------
class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


# --------------------------
# Employment Type Model
# --------------------------
class EmploymentType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


# --------------------------
# Job Model
# --------------------------
class Job(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('upcoming', 'Upcoming'),
        ('draft', 'Draft'),
    ]

    # Basic Information
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    location = models.CharField(max_length=200)

    # Job Details
    job_description = models.TextField()
    responsibilities = models.TextField()
    qualifications = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    salary_and_benefits = models.TextField(blank=True)
    how_to_apply = models.TextField(blank=True)
    encourage_applicants = models.TextField(blank=True)

    # Salary and Type
    employment_type = models.ForeignKey(EmploymentType, on_delete=models.PROTECT)
    min_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    no_of_employees = models.PositiveIntegerField(null=True, blank=True)

    # Contact Information
    phone_no = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)


    # Relationships
    job_category = models.ForeignKey(JobCategory, on_delete=models.CASCADE)
    posted_by = models.ForeignKey(FirebaseUser, on_delete=models.SET_NULL, null=True, blank=True)

    # Dates
    posted_on = models.DateField(null=True, blank=True)
    expired_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-posted_on']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

    def get_status(self):
        today = timezone.now().date()
        if not self.posted_on or not self.expired_date:
            return 'draft'
        if today < self.posted_on:
            return 'upcoming'
        if today <= self.expired_date:
            return 'active'
        return 'expired'