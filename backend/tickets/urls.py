from django.urls import path
from .views import GetTickets, DeleteTicketView, UpdateTicketView, CreateTicketView

urlpatterns = [
    path('get_tickets', GetTickets.as_view(), name='get_tickets'),
    path('delete_ticket/<int:ticket_id>/', DeleteTicketView.as_view(), name='delete_ticket'),
    path('update_ticket/<int:ticket_id>/', UpdateTicketView.as_view(), name='update_ticket'),
    path('create_ticket/', CreateTicketView.as_view(), name='create_ticket'),
]