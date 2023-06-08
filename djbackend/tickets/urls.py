from django.urls import path
from . import views

urlpatterns = [
    path('get_tickets_staff', views.GetStaffTickets.as_view(), name='ticket_api'),
]
