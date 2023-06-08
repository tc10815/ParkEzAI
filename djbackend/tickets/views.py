from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer

class GetStaffTickets(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        role_name = self.request.user.role.role_name

        role_category_mapping = {
            'Lot Specialist': 'Lot Owners',
            'Advertising Specialist': 'Advertisers'
        }

        if role_name in ['Customer Support', 'Accountant']:
            return Ticket.objects.select_related('user').all()
        elif role_name in ['Lot Specialist', 'Advertising Specialist']:
            category = role_category_mapping.get(role_name, "")
            return Ticket.objects.select_related('user').filter(category=category)
        else:
            return Ticket.objects.none()
