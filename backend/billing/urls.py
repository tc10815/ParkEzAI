from django.urls import path
from .views import PaymentMethodAPIView, InvoiceAPIView, CreatePaymentMethodAPIView

urlpatterns = [
    path('invoices/', InvoiceAPIView.as_view(), name='invoices'),
    path('payment-methods/', PaymentMethodAPIView.as_view(), name='payment-methods'),
    path('create-payment-method/', CreatePaymentMethodAPIView.as_view(), name='create-payment-method')
]