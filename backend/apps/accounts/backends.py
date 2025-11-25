"""
Custom authentication backends for the accounts app.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in with email instead of username.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        Authenticate a user based on email address as the username.
        
        Args:
            request: The HTTP request object
            username: The email address (despite parameter name)
            password: The user's password
            **kwargs: Additional keyword arguments
            
        Returns:
            User instance if authentication successful, None otherwise
        """
        # Check if email was passed in kwargs
        email = kwargs.get('email', username)
        
        if email is None or password is None:
            return None
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            User().set_password(password)
            return None
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        
        return None
