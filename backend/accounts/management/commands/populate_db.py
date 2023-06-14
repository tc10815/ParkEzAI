from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from accounts.models import CustomUser, Role
from tickets.models import Ticket

class Command(BaseCommand):
    help = 'Populate the database with example data'

    def handle(self, *args, **options):
        CustomUser.objects.all().delete()
        Role.objects.all().delete()
        Ticket.objects.all().delete()

        # Populate the database with example data
        roles = [
            ('Lot Operator', False),
            ('Advertiser', False),
            ('Customer Support', True),
            ('Lot Specialist', True),
            ('Advertising Specialist', True),
            ('Accountant', True)
        ]

        role_objects = [Role.objects.create(role_name=role_name, is_employee=is_employee) for role_name, is_employee in roles]

        users = [
            (role_objects[0], 'funky.chicken@example.com', 'Funky', 'Chicken', "Cluckin' Good", '123 Cluck St', 'NY', 'New York', '10001', 'funky123'),
            (role_objects[1], 'jolly.giraffe@example.com', 'Jolly', 'Giraffe', 'High Heads', '456 Tall Ave', 'CT', 'Hartford', '06103', 'jolly123'),
            (role_objects[2], 'curious.cat@parkez.com', 'Curious', 'Cat', 'Whisker Whispers', '789 Purr St', 'NJ', 'Newark', '07102', 'curious123'),
            (role_objects[3], 'chatty.penguin@parkez.com', 'Chatty', 'Penguin', 'Ice Breakers', '321 Waddle Ave', 'NY', 'Buffalo', '14201', 'chatty123'),
            (role_objects[4], 'happy.hippo@parkez.com', 'Happy', 'Hippo', 'River Riders', '654 Splash St', 'CT', 'Bridgeport', '06604', 'happy123'),
            (role_objects[5], 'lively.lemur@parkez.com', 'Lively', 'Lemur', 'Tree Jumpers', '987 Leap Ln', 'NJ', 'Jersey City', '07302', 'lively123')
        ]

        for role, email, first_name, last_name, company_name, company_address, state, city, zip, password in users:
            CustomUser.objects.create(
                username=email,  # set username to email
                email=email,
                role=role,
                first_name=first_name,
                last_name=last_name,
                company_name=company_name,
                company_address=company_address,
                state=state,
                city=city,
                zip=zip,
                password=make_password(password),
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

        demo_tickets = [
            {
                "user": CustomUser.objects.get(email='funky.chicken@example.com'),
                "subject": "Image recognition issue",
                "description": "One spot is recognized inconsistently.",
                "status": "Open",
                "priority": "Low",
                "category": "Lot Owners"
            },
            {
                "user": CustomUser.objects.get(email='funky.chicken@example.com'),
                "subject": "Need security data fast",
                "description": "A car was hijacked in my lot, I need raw data.",
                "status": "Open",
                "priority": "Urgent",
                "category": "Lot Owners"
            },
            {
                "user": CustomUser.objects.get(email='funky.chicken@example.com'),
                "subject": "Remove some footage",
                "description": "I accidentally recorded myself in the parking lot going someplace with my wife's sister. Can you help me delete the footage?",
                "status": "Resolved",
                "priority": "High",
                "category": "Lot Owners"
            },
            {
                "user": CustomUser.objects.get(email='funky.chicken@example.com'),
                "subject": "Car occupancy off by 1",
                "description": "It always says there's 1 extra car in the lot. Fix it.",
                "status": "Open",
                "priority": "Low",
                "category": "Lot Owners"
            },
            {
                "user": CustomUser.objects.get(email='jolly.giraffe@example.com'),
                "subject": "Payment issue",
                "description": "I was double billed for my Ad and need a refund.",
                "status": "In Progress",
                "priority": "Medium",
                "category": "Advertisers"
            },
            {
                "user": CustomUser.objects.get(email='jolly.giraffe@example.com'),
                "subject": "Posting image is not working",
                "description": "ParkEz does not support my file format.",
                "status": "Resolved",
                "priority": "Low",
                "category": "Advertisers"
            },
            {
                "user": CustomUser.objects.get(email='jolly.giraffe@example.com'),
                "subject": "Discount not applied",
                "description": "I thought I was supposed to get 20% off my account... refund the difference!",
                "status": "Closed",
                "priority": "High",
                "category": "Advertisers"
            },
        ]

        for ticket in demo_tickets:
            Ticket.objects.create(**ticket)