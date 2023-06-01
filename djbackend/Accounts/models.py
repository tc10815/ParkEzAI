from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    role_name = models.CharField(max_length=50)
    user_type = models.CharField(max_length=50)
    is_employee = models.BooleanField()

    def __str__(self):
        return self.role_name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    company_address = models.CharField(max_length=255)
    state = models.CharField(max_length=2)
    city = models.CharField(max_length=255)
    zip = models.CharField(max_length=10)
    is_uninitialized = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
