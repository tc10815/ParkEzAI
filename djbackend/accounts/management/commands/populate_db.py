from django.core.management.base import BaseCommand
from accounts.models import CustomUser, Role

class Command(BaseCommand):
    help = 'Populate the database with example data'

    def handle(self, *args, **options):
        # Delete all existing data
        CustomUser.objects.all().delete()
        Role.objects.all().delete()

        # Populate the database with example data
        role = Role.objects.create(role_name='Role 1', is_employee=False)  # Capture the created Role instance
        CustomUser.objects.create(
            email='test@example.com', 
            role=role,  # Assign the role instance
            first_name='Test', 
            last_name='User', 
            company_name='Test Company', 
            company_address='Test Address', 
            state='TS', 
            city='Test City', 
            zip='12345', 
            password='testpassword', 
            is_uninitialized=False
        )
