from rest_framework import serializers
from .models import CustomUser, Role
from dj_rest_auth.serializers import UserDetailsSerializer
from django.core.exceptions import ObjectDoesNotExist


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

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()  # Change this line

    class Meta:
        model = CustomUser
        fields = ['role', 'email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip', 'password', 'is_uninitialized']

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        password = validated_data.pop('password')
        try:
            role = Role.objects.get(role_name=role_name)
        except ObjectDoesNotExist:
            raise serializers.ValidationError('Role does not exist')

        validated_data['username'] = validated_data['email']

        user = CustomUser(role=role, **validated_data)
        user.set_password(password)
        user.save()
        return user
    
class CustomUserDetailsSerializer(UserDetailsSerializer):
    role_name = serializers.CharField(source='role.role_name')

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('role_name', 'is_uninitialized', 'company_name', 'company_address', 'city', 'state', 'zip')


class UserUpdateSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip', 'role_name']
