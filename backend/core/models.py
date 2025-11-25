"""
Base models for all apps in the system.
"""

import uuid
from django.db import models


class BaseModel(models.Model):
    """
    Abstract base model with common fields for all models.
    Includes UUID primary key, timestamps, and soft delete functionality.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the record was last updated"
    )
    is_deleted = models.BooleanField(
        default=False,
        help_text="Soft delete flag"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def soft_delete(self):
        """Soft delete the instance."""
        self.is_deleted = True
        self.save(update_fields=['is_deleted', 'updated_at'])

    def restore(self):
        """Restore a soft-deleted instance."""
        self.is_deleted = False
        self.save(update_fields=['is_deleted', 'updated_at'])
