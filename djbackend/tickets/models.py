from django.db import models
from django.utils import timezone
from accounts.models import CustomUser

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    CATEGORY_CHOICES = [
        ('Lot Owners', 'Lot Owners'),
        ('Advertisers', 'Advertisers'),
        ('General', 'General'),
    ]

    ticket_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Low')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='General')
    date_created = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.subject
