from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions, generics
from .models import CustomUser, Role
from .serializers import UserSerializer, UserCreateSerializer, CustomUserDetailsSerializer, UserUpdateSerializer, ChangePasswordSerializer, InitiateUserSerializer, UserPaymentSerializer
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import logout

class PopulateDBView(APIView):
    permission_classes = [permissions.AllowAny]  
    def get(self, request, *args, **kwargs):
        self.populate_db()
        return Response({"message": "Database populated successfully."}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        self.populate_db()
        return Response({"message": "Database populated successfully."}, status=status.HTTP_200_OK)

    def populate_db(self):
        call_command('populate_db')
        return Response({'status': 'Database populated'})

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CreateUserView(APIView):
    permission_classes = [permissions.AllowAny]  
    serializer_class = UserCreateSerializer

    def post(self, request, format=None):
        role = request.data.get('role')
        valid_roles = ['Lot Operator', 'Advertiser']

        if role not in valid_roles:
            return Response({"detail": "Invalid user role."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CustomUserDetailsSerializer

    def get_object(self):
        return self.request.user

class UpdateUserView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserUpdateSerializer

    # def get_object(self):
    #     return CustomUser.objects.get(email=self.request.data['email'])
    def get_object(self):
        return CustomUser.objects.get(email=self.request.user.email)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.get_object()
        role_name = self.request.user.role.role_name
        # check if the password is correct
        password = request.data.pop('password', None)
        if not password or not user.check_password(password):
            return Response({"message": "Incorrect password."}, status=status.HTTP_403_FORBIDDEN)
            
        # get the current user
        current_user = request.user

        # check if the current user has permission to edit the user
        if user == current_user or current_user.role.role_name == 'Accountant':
            pass  # current user is allowed to edit this user
        elif current_user.role.role_name == 'Customer Support' and user.role.role_name in ['Lot Operator', 'Advertiser']:
            pass  # current user is allowed to edit this user
        elif current_user.role.role_name == 'Lot Specialist' and user.role.role_name == 'Lot Operator':
            pass  # current user is allowed to edit this user
        elif current_user.role.role_name == 'Advertising Specialist' and user.role.role_name == 'Advertiser':
            pass  # current user is allowed to edit this user
        else:
            return Response({"message": "You do not have permission to edit this user."}, status=status.HTTP_403_FORBIDDEN)

        # determine the editable fields based on the user's role
        if user.role.role_name in ['Lot Operator', 'Advertiser']:
            editable_fields = ['email', 'first_name', 'last_name', 'company_name', 'company_address', 'state', 'city', 'zip']
        else:
            editable_fields = ['email', 'first_name', 'last_name']

        # remove non-editable fields from the request data
        for field in list(request.data.keys()):
            if field not in editable_fields:
                del request.data[field]

        # ensure the username is updated along with the email
        if 'email' in request.data:
            request.data['username'] = request.data['email']

        serializer = self.get_serializer(instance, data=request.data, partial=True) 
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def put(self, request, *args, **kwargs):
        self.user = self.request.user
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.user.set_password(serializer.data.get("new_password"))
            self.user.save()
            return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, format=None):
        user = self.request.user
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(password, user.password):
            return Response({'error': 'Password is incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserRolesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = self.request.user
        role_name = user.role.role_name
        # Determine the rules based on the role of the user
        if role_name == 'Accountant':
            queryset = CustomUser.objects.exclude(email=user.email).exclude(role__isnull=True)
        elif role_name == 'Customer Support':
            queryset = CustomUser.objects.filter(role__role_name__in=['Advertiser', 'Lot Operator'])
        elif role_name == 'Lot Specialist':
            queryset = CustomUser.objects.filter(role__role_name='Lot Operator')
        elif role_name == 'Advertising Specialist':
            queryset = CustomUser.objects.filter(role__role_name='Advertiser')
        else:
            return Response({'detail': 'You do not have permission to access this.'}, status=status.HTTP_403_FORBIDDEN)

        # Serialize the queryset
        serializer = UserSerializer(queryset, many=True)

        return Response(serializer.data)
    
class UserPaymentRolesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = self.request.user
        role_name = user.role.role_name

        # Determine the rules based on the role of the user
        if role_name == 'Accountant':
            queryset = CustomUser.objects.filter(role__role_name__in=['Advertiser', 'Lot Operator'])
        elif role_name == 'Customer Support':
            queryset = CustomUser.objects.filter(role__role_name__in=['Advertiser', 'Lot Operator'])
        elif role_name == 'Lot Specialist':
            queryset = CustomUser.objects.filter(role__role_name='Lot Operator')
        elif role_name == 'Advertising Specialist':
            queryset = CustomUser.objects.filter(role__role_name='Advertiser')
        else:
            return Response({'detail': 'You do not have permission to access this.'}, status=status.HTTP_403_FORBIDDEN)

        # Serialize the queryset
        serializer = UserPaymentSerializer(queryset, many=True)

        return Response(serializer.data)

class UserDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, format=None):
        user = self.request.user
        role_name = user.role.role_name

        # retrieve the email of the user to be deleted from the request
        email_to_delete = request.data.get('email')

        if not email_to_delete:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # retrieve the user to be deleted
        try:
            user_to_delete = CustomUser.objects.get(email=email_to_delete)
        except ObjectDoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if role_name == 'Accountant':
            user_to_delete.delete()
        elif role_name == 'Customer Support' and user_to_delete.role.role_name in ['Advertiser', 'Lot Operator']:
            user_to_delete.delete()
        elif role_name == 'Lot Specialist' and user_to_delete.role.role_name == 'Lot Operator':
            user_to_delete.delete()
        elif role_name == 'Advertising Specialist' and user_to_delete.role.role_name == 'Advertiser':
            user_to_delete.delete()
        else:
            return Response({'detail': 'You do not have permission to delete this user.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_204_NO_CONTENT)

class ChangePasswordRoleBasedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        new_password = request.data.get('new_password', '')

        if not email or not new_password:
            return Response({'error': 'Email and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_change = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        user_requesting = request.user
        requesting_role_name = user_requesting.role.role_name

        # Define who can change who
        valid_role_changes = {
            'Accountant': ['Advertiser', 'Lot Operator', 'Customer Support', 'Lot Specialist', 'Advertising Specialist'],
            'Customer Support': ['Advertiser', 'Lot Operator'],
            'Lot Specialist': ['Lot Operator'],
            'Advertising Specialist': ['Advertiser'],
        }

        user_to_change_role_name = user_to_change.role.role_name

        if user_to_change_role_name not in valid_role_changes.get(requesting_role_name, []):
            raise PermissionDenied("You don't have permission to change this user's password.")

        user_to_change.set_password(new_password)
        user_to_change.save()
        return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)

class CreateEmployeeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserCreateSerializer

    def post(self, request, format=None):
        role_name = self.request.user.role.role_name
        if role_name != 'Accountant':
            return Response({"message": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()  # make a copy of the data
        data['role'] = data.pop('role_name')  # replace 'role_name' with 'role'
        data['is_uninitialized'] = True

        serializer = self.serializer_class(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InitiateUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InitiateUserSerializer

    def put(self, request, *args, **kwargs):
        self.user = self.request.user
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.user.set_password(serializer.data.get("new_password"))
            self.user.first_name = serializer.data.get("first_name")
            self.user.last_name = serializer.data.get("last_name")
            self.user.is_uninitialized = False
            self.user.save()
            return Response({"success": "User initiated successfully."}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def get(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)

class AdvertiserUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        role_name = self.request.user.role.role_name

        # Check if the current user has the appropriate role to access this view
        if str(role_name) not in ['Accountant', 'Customer Support', 'Advertising Specialist']: 
            return Response({'detail': 'You do not have permission to access this.'}, status=status.HTTP_403_FORBIDDEN)

        # Filter users by role_name
        advertiser_role = Role.objects.get(role_name="Advertiser")
        advertisers = CustomUser.objects.filter(role=advertiser_role)

        # Serialize the queryset
        serializer = UserSerializer(advertisers, many=True)

        return Response(serializer.data)
