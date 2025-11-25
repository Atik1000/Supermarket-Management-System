"""
Custom permissions for the API.
"""

from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission check for admin users only.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsAdminOrManager(permissions.BasePermission):
    """
    Permission check for admin or manager users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'manager']
        )


class IsCashier(permissions.BasePermission):
    """
    Permission check for cashier users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['cashier', 'manager', 'admin']
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.role in ['admin', 'manager']:
            return True
        
        # Check if object has user_id or user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'user_id'):
            return obj.user_id == request.user.id
        
        return False


class ReadOnly(permissions.BasePermission):
    """
    Permission that allows read-only access (GET, HEAD, OPTIONS).
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
