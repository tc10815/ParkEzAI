from rest_framework import generics, status
from rest_framework.views import APIView
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
            # Instead of using union, get the querysets separately and concatenate them in Python
            lot_invoices = list(LotInvoice.objects.all())
            ad_invoices = list(AdvertisementInvoice.objects.all())
            return lot_invoices + ad_invoices
        elif user_role == 'Lot Specialist':
            return LotInvoice.objects.all()
        elif user_role == 'Advertising Specialist':
            return AdvertisementInvoice.objects.all()
        else:
            return []

    def list(self, request):
        queryset = self.get_queryset()
        serialized_data = []

        for invoice in queryset:
            if isinstance(invoice, LotInvoice):
                serializer = LotInvoiceSerializer(invoice)
                prefix = 'op-'
            elif isinstance(invoice, AdvertisementInvoice):
                serializer = AdvertisementInvoiceSerializer(invoice)
                prefix = 'ad-'
            else:
                continue  # or handle other cases if needed

            # Format the invoice ID
            obj = serializer.data
            obj['invoice_id'] = prefix + str(obj['invoice_id'])
            serialized_data.append(obj)

        return Response(serialized_data)


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
    
class CreatePaymentMethodAPIView(APIView):

    def post(self, request):
        user = self.request.user
        user_role = user.role.role_name
        data = request.data
        print(data)

        if user_role in ['Lot Operator', 'Advertiser']:
            data['customer'] = user.id
        elif user_role in ['Lot Specialist', 'Customer Support', 'Accountant']:
            # Check if customer_id is provided in the request
            customer_id = data.get('customer_id')
            if not customer_id:
                return Response({"error": "customer_id is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the role of the customer
            try:
                customer = CustomUser.objects.get(id=customer_id)
            except CustomUser.DoesNotExist:
                return Response({"error": "Customer does not exist."}, status=status.HTTP_404_NOT_FOUND)

            if user_role == 'Lot Specialist' and customer.role.role_name != 'Lot Operator':
                return Response({"error": "You can only create payment methods for Lot Operators."}, status=status.HTTP_403_FORBIDDEN)
            elif user_role in ['Customer Support', 'Accountant'] and customer.role.role_name not in ['Lot Operator', 'Advertiser']:
                return Response({"error": "You can only create payment methods for Advertisers or Lot Operators."}, status=status.HTTP_403_FORBIDDEN)

            data['customer'] = customer_id
        else:
            return Response({"error": "You don't have permission to create a payment method."}, status=status.HTTP_403_FORBIDDEN)

        serializer = PaymentMethodSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)