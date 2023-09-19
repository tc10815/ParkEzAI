from django.urls import path
from .views import PaymentMethodAPIView, InvoiceAPIView, CreatePaymentMethodAPIView, DeletePaymentMethodAPIView, \
    CreateLotInvoiceAPIView, CreateAdvertisementInvoiceAPIView,  DeleteLotInvoice, DeleteAdInvoice, PayInvoice

urlpatterns = [
    path('invoices/', InvoiceAPIView.as_view(), name='invoices'),
    path('payment-methods/', PaymentMethodAPIView.as_view(), name='payment-methods'),
    path('create-payment-method/', CreatePaymentMethodAPIView.as_view(), name='create-payment-method'),
    path('delete-payment-method/<int:pk>/', DeletePaymentMethodAPIView.as_view(), name='delete-payment-method'),
    path('create-lot-invoice/', CreateLotInvoiceAPIView.as_view(), name='create-lot-billing-invoice'),
    path('create-ad-invoice/', CreateAdvertisementInvoiceAPIView.as_view(), name='create-ad-billing-invoice'),
    path('delete-lot-invoice/<int:pk>/', DeleteLotInvoice.as_view(), name='delete-lot-invoice'),
    path('delete-ad-invoice/<int:pk>/', DeleteAdInvoice.as_view(), name='delete-ad-invoice'),
    path('pay-invoice/', PayInvoice.as_view(), name='pay-invoice'),
]