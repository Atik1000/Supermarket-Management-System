import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    """Return API client"""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Factory to create users"""
    def make_user(**kwargs):
        defaults = {
            'email': 'test@example.com',
            'username': 'testuser',
            'phone': '+8801712345678',
            'role': 'customer',
        }
        defaults.update(kwargs)
        password = defaults.pop('password', 'testpass123')
        user = User.objects.create_user(**defaults)
        user.set_password(password)
        user.save()
        return user
    return make_user


@pytest.fixture
def admin_user(create_user):
    """Return admin user"""
    return create_user(
        email='admin@example.com',
        username='admin',
        phone='+8801712345679',
        role='super_admin',
        is_staff=True,
        is_superuser=True
    )


@pytest.fixture
def authenticated_client(api_client, create_user):
    """Return authenticated API client"""
    user = create_user()
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = user
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Return authenticated admin API client"""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    api_client.user = admin_user
    return api_client


@pytest.mark.django_db
class TestRegistration:
    """Test user registration"""

    def test_register_success(self, api_client):
        """Test successful user registration"""
        url = reverse('accounts:register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'phone': '+8801712345680',
            'password': 'NewPass123!',
            'password_confirm': 'NewPass123!',
            'first_name': 'New',
            'last_name': 'User',
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == data['email']
        assert response.data['user']['role'] == 'customer'

    def test_register_password_mismatch(self, api_client):
        """Test registration with password mismatch"""
        url = reverse('accounts:register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'phone': '+8801712345680',
            'password': 'NewPass123!',
            'password_confirm': 'DifferentPass123!',
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        # Check if password error exists in either format
        assert 'password' in response.data or ('errors' in response.data and 'password' in response.data['errors'])

    def test_register_duplicate_email(self, api_client, create_user):
        """Test registration with existing email"""
        existing_user = create_user()
        url = reverse('accounts:register')
        data = {
            'email': existing_user.email,
            'username': 'newuser',
            'phone': '+8801712345680',
            'password': 'NewPass123!',
            'password_confirm': 'NewPass123!',
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestAuthentication:
    """Test authentication endpoints"""

    def test_login_success(self, api_client, create_user):
        """Test successful login"""
        user = create_user()
        url = reverse('accounts:login')
        data = {
            'email': user.email,
            'password': 'testpass123',
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data

    def test_login_invalid_credentials(self, api_client, create_user):
        """Test login with invalid credentials"""
        user = create_user()
        url = reverse('accounts:login')
        data = {
            'email': user.email,
            'password': 'wrongpassword',
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_token_refresh(self, api_client, create_user):
        """Test token refresh"""
        user = create_user()
        refresh = RefreshToken.for_user(user)
        url = reverse('accounts:token_refresh')
        data = {
            'refresh': str(refresh),
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_logout(self, authenticated_client):
        """Test logout"""
        # Get refresh token
        refresh = RefreshToken.for_user(authenticated_client.user)
        url = reverse('accounts:logout')
        data = {
            'refresh': str(refresh),
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == 'Logout successful.'


@pytest.mark.django_db
class TestUserProfile:
    """Test user profile endpoints"""

    def test_get_current_user(self, authenticated_client):
        """Test getting current user profile"""
        url = reverse('accounts:current-user')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == authenticated_client.user.email

    def test_get_current_user_unauthorized(self, api_client):
        """Test getting current user without authentication"""
        url = reverse('accounts:current-user')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile(self, authenticated_client):
        """Test updating user profile"""
        url = reverse('accounts:update-profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone': '+8801712345681',
        }
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['first_name'] == data['first_name']
        assert response.data['last_name'] == data['last_name']


@pytest.mark.django_db
class TestUserViewSet:
    """Test user management viewset"""

    def test_list_users_as_admin(self, admin_client):
        """Test listing users as admin"""
        url = reverse('accounts:user-list')
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data

    def test_list_users_as_regular_user(self, authenticated_client):
        """Test listing users as regular user (should fail)"""
        url = reverse('accounts:user-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_user_as_admin(self, admin_client):
        """Test creating user as admin"""
        url = reverse('accounts:user-list')
        data = {
            'email': 'newadmin@example.com',
            'username': 'newadmin',
            'phone': '+8801712345682',
            'password': 'AdminPass123!',
            'password_confirm': 'AdminPass123!',
            'role': 'admin',
        }
        response = admin_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['role'] == 'admin'

    def test_get_user_detail(self, authenticated_client, create_user):
        """Test getting user detail"""
        user = create_user(email='detail@example.com', username='detailuser', phone='+8801712345683')
        url = reverse('accounts:user-detail', kwargs={'pk': user.id})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_change_password(self, authenticated_client):
        """Test changing password"""
        url = reverse('accounts:user-change-password')
        data = {
            'old_password': 'testpass123',
            'new_password': 'NewPass123!',
            'new_password_confirm': 'NewPass123!',
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data

    def test_change_password_wrong_old_password(self, authenticated_client):
        """Test changing password with wrong old password"""
        url = reverse('accounts:user-change-password')
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'NewPass123!',
            'new_password_confirm': 'NewPass123!',
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_deactivate_user_as_admin(self, admin_client, create_user):
        """Test deactivating user as admin"""
        user = create_user(email='deactivate@example.com', username='deactivateuser', phone='+8801712345684')
        url = reverse('accounts:user-deactivate', kwargs={'pk': user.id})
        response = admin_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert not user.is_active

    def test_activate_user_as_admin(self, admin_client, create_user):
        """Test activating user as admin"""
        user = create_user(
            email='activate@example.com',
            username='activateuser',
            phone='+8801712345685',
            is_active=False
        )
        url = reverse('accounts:user-activate', kwargs={'pk': user.id})
        response = admin_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.is_active
