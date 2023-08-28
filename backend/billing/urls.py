from django.urls import path
from .views import PaymentMethodAPIView, InvoiceAPIView, CreatePaymentMethodAPIView, DeletePaymentMethodAPIView, CreateLotInvoiceAPIView, CreateAdvertisementInvoiceAPIView

urlpatterns = [
    path('invoices/', InvoiceAPIView.as_view(), name='invoices'),
    path('payment-methods/', PaymentMethodAPIView.as_view(), name='payment-methods'),
    path('create-payment-method/', CreatePaymentMethodAPIView.as_view(), name='create-payment-method'),
    path('delete-payment-method/<int:pk>/', DeletePaymentMethodAPIView.as_view(), name='delete-payment-method'),
    path('create-lot-invoice/', CreateLotInvoiceAPIView.as_view(), name='create-lot-billing-invoice'),
    path('create-ad-invoice/', CreateAdvertisementInvoiceAPIView.as_view(), name='create-ad-billing-invoice')
]