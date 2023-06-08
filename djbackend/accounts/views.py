from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions, generics
from .models import CustomUser, Role
from .serializers import UserSerializer, UserCreateSerializer, CustomUserDetailsSerializer

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