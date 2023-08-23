from django.urls import path
from .views import PaymentMethodAPIView, InvoiceAPIView

urlpatterns = [
    path('invoices/', InvoiceAPIView.as_view(), name='invoices'),
    path('payment-methods/', PaymentMethodAPIView.as_view(), name='payment-methods')
]