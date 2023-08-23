from rest_framework import generics
from rest_framework.response import Response
from .models import LotInvoice, AdvertisementInvoice, PaymentMethod
from .serializers import LotInvoiceSerializer, AdvertisementInvoiceSerializer, PaymentMethodSerializer
from accounts.models import CustomUser, Role

class InvoiceAPIView(generics.ListAPIView):

    def get_queryset(self):
        user = self.request.user
        user_role = user.role.role_name

        if user_role == 'Lot Operator':
            return LotInvoice.objects.filter(customer=user)
        elif user_role == 'Advertiser':
            return AdvertisementInvoice.objects.filter(customer=user)
        elif user_role in ['Customer Support', 'Accountant']:
            # Returning all Lot and Advertisement Invoices (Modify as needed)
            return LotInvoice.objects.all().union(AdvertisementInvoice.objects.all())
        elif user_role == 'Lot Specialist':
            return LotInvoice.objects.all()
        elif user_role == 'Advertising Specialist':
            return AdvertisementInvoice.objects.all()
        else:
            return []

    def list(self, request):
        queryset = self.get_queryset()

        if queryset.exists():
            if isinstance(queryset.first(), LotInvoice):
                serializer = LotInvoiceSerializer(queryset, many=True)
                prefix = 'op-'
            else:
                serializer = AdvertisementInvoiceSerializer(queryset, many=True)
                prefix = 'ad-'
            
            # Format the invoice ID
            for obj in serializer.data:
                obj['invoice_id'] = prefix + str(obj['invoice_id'])

        else:
            return Response([])

        return Response(serializer.data)


class PaymentMethodAPIView(generics.ListAPIView):

    def get_queryset(self):
        user = self.request.user
        user_role = user.role.role_name

        if user_role == 'Lot Operator':
            return PaymentMethod.objects.filter(customer=user)
        elif user_role == 'Advertiser':
            return PaymentMethod.objects.filter(customer=user)
        elif user_role in ['Customer Support', 'Accountant']:
            return PaymentMethod.objects.all()
        elif user_role in ['Lot Specialist', 'Advertising Specialist']:
            # Assuming Lot and Advertising Specialists can view all payment methods
            # Modify as needed if they should have restricted access
            return PaymentMethod.objects.all()
        else:
            return []

    def list(self, request):
        queryset = self.get_queryset()
        serializer = PaymentMethodSerializer(queryset, many=True)
        return Response(serializer.data)