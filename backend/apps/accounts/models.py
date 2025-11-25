"""
User and authentication models for the Supermarket Management System.
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from core.models import BaseModel


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Adds role-based access control and phone number.
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('cashier', 'Cashier'),
        ('delivery', 'Delivery'),
        ('customer', 'Customer'),
    ]
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        unique=True,
        help_text="Phone number in international format"
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer',
        help_text="User role in the system"
    )
    email = models.EmailField(unique=True, help_text="Email address")
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self) -> str:
        return f"{self.email} ({self.get_role_display()})"
    
    def get_full_name(self) -> str:
        """Return the full name of the user."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    @property
    def is_admin_or_manager(self) -> bool:
        """Check if user is admin or manager."""
        return self.role in ['admin', 'manager', 'super_admin']


class UserProfile(BaseModel):
    """
    Extended profile information for users.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        help_text="Associated user account"
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        help_text="Profile picture"
    )
    address = models.TextField(blank=True, help_text="Street address")
    city = models.CharField(max_length=100, blank=True, help_text="City")
    postal_code = models.CharField(max_length=20, blank=True, help_text="Postal/ZIP code")
    country = models.CharField(max_length=100, default='Bangladesh', help_text="Country")
    date_of_birth = models.DateField(null=True, blank=True, help_text="Date of birth")
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self) -> str:
        return f"Profile of {self.user.email}"
