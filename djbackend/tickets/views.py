from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
from django.http import Http404


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

class DeleteTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, ticket_id):
        try:
            return Ticket.objects.get(ticket_id=ticket_id)
        except Ticket.DoesNotExist:
            raise Http404

    def get(self, request, ticket_id, format=None):
        ticket = self.get_object(ticket_id)
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    def delete(self, request, ticket_id, format=None):
        ticket = self.get_object(ticket_id)
        role_name = self.request.user.role.role_name

        role_category_mapping = {
            'Lot Specialist': 'Lot Owners',
            'Advertising Specialist': 'Advertisers'
        }

        if role_name in ['Customer Support', 'Accountant']:
            ticket.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif role_name in ['Lot Specialist', 'Advertising Specialist']:
            category = role_category_mapping.get(role_name, "")
            if ticket.category == category:
                ticket.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)