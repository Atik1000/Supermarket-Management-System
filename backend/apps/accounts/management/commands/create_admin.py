"""
Custom management command to create a superuser with all required fields.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a superuser account with all required fields'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Email address')
        parser.add_argument('--phone', type=str, help='Phone number')
        parser.add_argument('--password', type=str, help='Password')

    def handle(self, *args, **options):
        email = options.get('email') or 'admin@supermarket.com'
        phone = options.get('phone') or '+8801712345678'
        password = options.get('password') or 'admin123'

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists!'))
            return

        user = User.objects.create_superuser(
            username='admin',
            email=email,
            phone=phone,
            password=password,
            first_name='Super',
            last_name='Admin',
            role='super_admin'
        )

        self.stdout.write(self.style.SUCCESS(f'Successfully created superuser!'))
        self.stdout.write(f'Email: {email}')
        self.stdout.write(f'Phone: {phone}')
        self.stdout.write(f'Password: {password}')
        self.stdout.write(self.style.WARNING('Please change the password after first login!'))
