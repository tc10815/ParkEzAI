from django.urls import path
from .views import GetStaffTickets, DeleteTicketView

urlpatterns = [
    path('get_tickets_staff', GetStaffTickets.as_view(), name='get_tickets_staff'),
    path('delete_ticket/<int:ticket_id>/', DeleteTicketView.as_view(), name='delete_ticket'),
]
