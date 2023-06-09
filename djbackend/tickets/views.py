from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
from django.http import Http404

class CreateTicketView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def create(self, request, *args, **kwargs):
        role_name = self.request.user.role.role_name
        user = self.request.user

        role_category_mapping = {
            'Lot Specialist': 'Lot Owners',
            'Advertising Specialist': 'Advertisers'
        }

        category = role_category_mapping.get(role_name, 'General')

        request.data['category'] = category
        request.data['user'] = user.id

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GetTickets(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        user = self.request.user
        role_name = user.role.role_name

        role_category_mapping = {
            'Lot Specialist': 'Lot Owners',
            'Advertising Specialist': 'Advertisers'
        }

        if role_name in ['Customer Support', 'Accountant']:
            return Ticket.objects.select_related('user').all()
        elif role_name in ['Lot Specialist', 'Advertising Specialist']:
            category = role_category_mapping.get(role_name, "")
            return Ticket.objects.select_related('user').filter(category=category)
        elif role_name in ['Lot Operator', 'Advertiser']:
            return Ticket.objects.select_related('user').filter(user=user)
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
        current_user = self.request.user

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
        elif role_name in ['Lot Operator', 'Advertiser']:
            if ticket.user == current_user:
                ticket.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        
class UpdateTicketView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer
    lookup_field = 'ticket_id'
    queryset = Ticket.objects.all()

    def update(self, request, *args, **kwargs):
        print('gets to update, ext line  is request data')
        print(request.data)
        instance = self.get_object()
        role_name = self.request.user.role.role_name

        role_category_mapping = {
            'Lot Specialist': 'Lot Owners',
            'Advertising Specialist': 'Advertisers'
        }

        if role_name in ['Customer Support', 'Accountant']:
            print('can edit all')
            serializer = self.get_serializer(instance, data=request.data, partial=True)
        elif role_name in ['Lot Specialist', 'Advertising Specialist']:
            category = role_category_mapping.get(role_name, "")
            print('category is ' + category)
            print('instance cat is ' + category)
            if instance.category != category:
                return Response({'message': 'You do not have the permissions to update this ticket'}, status=status.HTTP_403_FORBIDDEN)
            serializer = self.get_serializer(instance, data=request.data, partial=True)
        else:
            return Response({'message': 'You do not have the permissions to update this ticket'}, status=status.HTTP_403_FORBIDDEN)

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
