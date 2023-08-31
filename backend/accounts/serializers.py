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
        fields = ['role', 'email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip', 'is_uninitialized', 'id']

class UserPaymentSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)  # Embed role information

    class Meta:
        model = CustomUser
        # Include any other non-sensitive fields you want to expose
        fields = ['id','role', 'email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip', 'is_uninitialized']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ['role', 'email', 'password', 'first_name', 'last_name', 'company_name', 
                  'company_address', 'state', 'city', 'zip', 'is_uninitialized']

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        password = validated_data.pop('password')
        try:
            role = Role.objects.get(role_name=role_name)
        except ObjectDoesNotExist:
            raise serializers.ValidationError('Role does not exist')

        validated_data['username'] = validated_data['email']
        validated_data['first_name'] = validated_data.get('first_name', '')
        validated_data['last_name'] = validated_data.get('last_name', '')
        validated_data['company_name'] = validated_data.get('company_name', '')
        validated_data['company_address'] = validated_data.get('company_address', '')
        validated_data['state'] = validated_data.get('state', '')
        validated_data['city'] = validated_data.get('city', '')
        validated_data['zip'] = validated_data.get('zip', '')
        validated_data['is_uninitialized'] = validated_data.get('is_uninitialized', False)

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

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if 'email' in validated_data:
            instance.username = validated_data['email']
            instance.save()
        return instance
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class InitiateUserSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class CreateEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_name = serializers.CharField()
    

    class Meta:
        model = CustomUser
        fields = ['role', 'email', 'password', 'is_uninitialized']

    def validate_role_name(self, role):
        allowed_roles = ['Customer Support', 'Lot Specialist', 'Advertising Specialist', 'Accountant']
        if role.role_name not in allowed_roles:
            raise serializers.ValidationError('Invalid role selected.')
        return role.role_name

    def create(self, validated_data):
        role_name = validated_data.pop('role_name')
        password = validated_data.pop('password')
        role = None
        try:
            role = Role.objects.get(role_name=role_name)
        except ObjectDoesNotExist:
            raise serializers.ValidationError('Role does not exist')

        validated_data['username'] = validated_data['email']
        validated_data['role'] = role

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
