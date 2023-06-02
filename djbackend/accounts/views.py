from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import CustomUser, Role
from .serializers import UserSerializer


class PopulateDBView(APIView):
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
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
