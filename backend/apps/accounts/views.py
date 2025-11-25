from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from core.permissions import IsAdminUser, IsAdminOrManager, IsOwnerOrAdmin
from .models import UserProfile
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
)

User = get_user_model()


@extend_schema_view(
    list=extend_schema(description='List all users (Admin/Manager only)'),
    retrieve=extend_schema(description='Get user details'),
    create=extend_schema(description='Create new user (Admin only)'),
    update=extend_schema(description='Update user'),
    partial_update=extend_schema(description='Partially update user'),
    destroy=extend_schema(description='Delete user (Admin only)'),
)
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users.
    
    Admin/Manager can list and view all users.
    Users can view and update their own profile.
    """
    queryset = User.objects.select_related('profile').all()
    serializer_class = UserSerializer
    filterset_fields = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'username', 'phone', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email', 'username']
    ordering = ['-date_joined']

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'destroy']:
            permission_classes = [IsAdminUser]
        elif self.action == 'list':
            permission_classes = [IsAdminOrManager]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    @extend_schema(
        description='Get current user profile',
        responses={200: UserSerializer}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        description='Change user password',
        request=ChangePasswordSerializer,
        responses={200: {'description': 'Password changed successfully'}}
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Set new password
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({
            'message': 'Password changed successfully.'
        })

    @extend_schema(
        description='Deactivate user account',
        responses={200: {'description': 'Account deactivated'}}
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def deactivate(self, request, pk=None):
        """Deactivate user account"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({
            'message': f'User {user.email} has been deactivated.'
        })

    @extend_schema(
        description='Activate user account',
        responses={200: {'description': 'Account activated'}}
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activate(self, request, pk=None):
        """Activate user account"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({
            'message': f'User {user.email} has been activated.'
        })


@extend_schema(
    description='Register a new customer account',
    request=RegisterSerializer,
    responses={201: UserSerializer}
)
class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for user registration.
    Creates a new customer account.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Create new user and return user data with tokens"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Return user data with tokens
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Registration successful.'
        }, status=status.HTTP_201_CREATED)


@extend_schema(
    description='Login with email/username and password',
    request=CustomTokenObtainPairSerializer,
    responses={200: CustomTokenObtainPairSerializer}
)
class LoginView(TokenObtainPairView):
    """
    Login endpoint.
    Returns JWT tokens and user data.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@extend_schema(
    description='Logout and blacklist refresh token',
    request={'refresh': 'string'},
    responses={200: {'description': 'Logout successful'}}
)
class LogoutView(generics.GenericAPIView):
    """
    Logout endpoint.
    Blacklists the refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Blacklist refresh token"""
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Logout successful.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    description='Get current authenticated user profile',
    responses={200: UserSerializer}
)
class CurrentUserView(generics.RetrieveAPIView):
    """
    Get current user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Return current user"""
        return self.request.user


@extend_schema(
    description='Update current user profile',
    request=UserUpdateSerializer,
    responses={200: UserSerializer}
)
class UpdateProfileView(generics.UpdateAPIView):
    """
    Update current user's profile.
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Return current user"""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """Update profile and return updated user data"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return full user data
        user_serializer = UserSerializer(instance)
        return Response(user_serializer.data)
