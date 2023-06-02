from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from accounts.models import CustomUser, Role

class Command(BaseCommand):
    help = 'Populate the database with example data'

    def handle(self, *args, **options):
        # Delete all existing data
        CustomUser.objects.all().delete()
        Role.objects.all().delete()

        # Populate the database with example data
        roles = [
            ('Lot Operator', False),
            ('Advertiser', False),
            ('Customer Support', True),
            ('Lot Specialist', True),
            ('Advertising Specialist', True),
            ('Accountant', True)
        ]

        for role_name, is_employee in roles:
            Role.objects.create(role_name=role_name, is_employee=is_employee)

        # Let's create a test user for each role
        for role in Role.objects.all():
            email = f'test_{role.role_name}@example.com'
            CustomUser.objects.create(
                username=email,  # set username to email
                email=email, 
                role=role,
                first_name='Test', 
                last_name='User', 
                company_name='Test Company', 
                company_address='Test Address', 
                state='TS', 
                city='Test City', 
                zip='12345', 
                password=make_password('testpassword'), 
                is_uninitialized=False
            )

        # Create a superuser
        CustomUser.objects.create_superuser(
            username='twcookson@gmail.com',  # set username to email
            email='twcookson@gmail.com', 
            password='1234', 
            first_name='Tom', 
            last_name='Cookson'
        )
