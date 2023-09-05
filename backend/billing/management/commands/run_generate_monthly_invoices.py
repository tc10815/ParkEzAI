from django.core.management.base import BaseCommand
from billing.tasks import generate_monthly_invoices

class Command(BaseCommand):
    help = 'Runs the generate_monthly_invoices method from tasks.py'

    def handle(self, *args, **kwargs):
        generate_monthly_invoices()
        self.stdout.write(self.style.SUCCESS('Successfully generated monthly invoices.'))
