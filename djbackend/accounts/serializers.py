from rest_framework import serializers
from .models import CustomUser, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_name', 'is_employee']

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)  # Embed role information

    class Meta:
        model = CustomUser
        # Include any other non-sensitive fields you want to expose
        fields = ['role', 'email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip', 'is_uninitialized']
