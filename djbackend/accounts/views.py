from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions, generics
from .models import CustomUser, Role
from .serializers import UserSerializer, UserCreateSerializer, CustomUserDetailsSerializer, UserUpdateSerializer, ChangePasswordSerializer
from django.contrib.auth.hashers import check_password

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
        print('gets to update, ext line  is request data')
        print(current_user)




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

        print(request.data)
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
