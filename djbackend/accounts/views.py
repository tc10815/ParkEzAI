from django.core.management import call_command
from rest_framework.views import APIView
from rest_framework.response import Response

class PopulateDBView(APIView):
    def get(self, request):
        call_command('populate_db')
        return Response({'status': 'Database populated'})
