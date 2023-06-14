from rest_framework import serializers
from .models import Ticket
from accounts.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email']


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = ['ticket_id', 'user', 'subject', 'description', 'status', 'priority', 'category', 'date_created', 'date_updated']
