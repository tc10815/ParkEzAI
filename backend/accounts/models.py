from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator

class Role(models.Model):
    role_name = models.CharField(max_length=50)
    is_employee = models.BooleanField()

    def __str__(self):
        return self.role_name

class CustomUser(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    company_address = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=2, validators=[MinLengthValidator(2)], null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    zip = models.CharField(max_length=5, validators=[MinLengthValidator(5)], null=True, blank=True)
    is_uninitialized = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

