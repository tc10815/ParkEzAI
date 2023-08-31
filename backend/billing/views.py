from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LotInvoice, AdvertisementInvoice, PaymentMethod
from .serializers import LotInvoiceSerializer, AdvertisementInvoiceSerializer, PaymentMethodSerializer, CreateLotInvoiceSerializer, CreateAdvertisementInvoiceSerializer
from accounts.models import CustomUser, Role
from datetime import datetime

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
        data = dict(request.data)  # Create a mutable copy of the request data
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
        if serializer.is_valid(raise_exception=True): 
            customer_instance = CustomUser.objects.get(id=data['customer'])
            serializer.save(customer=customer_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class DeletePaymentMethodAPIView(generics.DestroyAPIView):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        user_role = user.role.role_name
        instance = self.get_object()

        if instance.customer == user:
            pass
        elif user_role in ['Customer Support', 'Accountant', 'Lot Specialist', 'Advertising Specialist']:
            pass
        else:
            return Response({"error": "You don't have permission to delete this payment method."}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateLotInvoiceAPIView(APIView):
    def post(self, request):
        print(request.data)
        user = self.request.user
        if user.role.role_name != 'Accountant':
            return Response({"error": "Only Accountants can create invoices."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if payment_method is an empty string and set it to None
        if request.data.get('payment_method') == "":
            request.data['payment_method'] = None
        
        serializer = CreateLotInvoiceSerializer(data=request.data)
        if not serializer.is_valid():
            print('serializer errors')
            print(serializer.errors)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateAdvertisementInvoiceAPIView(APIView):
    def post(self, request):
        print(request.data)  # Print request data for debugging
        
        user = self.request.user
        if user.role.role_name != 'Accountant':
            return Response({"error": "Only Accountants can create invoices."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if payment_method is an empty string and set it to None
        if request.data.get('payment_method') == "":
            request.data['payment_method'] = None
        
        serializer = CreateAdvertisementInvoiceSerializer(data=request.data)
        if not serializer.is_valid():
            print('serializer errors')  # Fixed the typo here
            print(serializer.errors)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteLotInvoice(generics.DestroyAPIView):
    queryset = LotInvoice.objects.all()
    serializer_class = LotInvoiceSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        user_role = user.role.role_name

        if user_role != 'Accountant':
            return Response({"error": "Only Accountants can delete Lot Invoices."}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DeleteAdInvoice(generics.DestroyAPIView):
    queryset = AdvertisementInvoice.objects.all()
    serializer_class = AdvertisementInvoiceSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        user_role = user.role.role_name

        if user_role != 'Accountant':
            return Response({"error": "Only Accountants can delete Advertisement Invoices."}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PayInvoice(APIView):
    
    def post(self, request):
        # Check if user is logged in
        user = self.request.user
        if not user:
            return Response({"error": "Please log in."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get the request data
        is_ad_invoice = request.data.get('is_ad_invoice')
        invoice_id = request.data.get('invoice_id')
        payment_method_id = request.data.get('payment_method')
        
        # Get the Invoice model based on isAdInvoice
        InvoiceModel = AdvertisementInvoice if is_ad_invoice else LotInvoice
        try:
            invoice = InvoiceModel.objects.get(pk=invoice_id)
        except InvoiceModel.DoesNotExist:
            return Response({"error": f"Invoice with ID {invoice_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        # Validate Payment Method
        try:
            payment_method = PaymentMethod.objects.get(pk=payment_method_id)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Invalid payment method."}, status=status.HTTP_404_NOT_FOUND)
        
        if payment_method.customer != invoice.customer:
            return Response({"error": "Payment method not associated with invoice customer."}, status=status.HTTP_400_BAD_REQUEST)

        # Check permissions based on user role
        user_role = user.role.role_name
        if user_role in ["Lot Operator", "Advertiser"] and invoice.customer != user:
            return Response({"error": "You don't have permission to pay this invoice."}, status=status.HTTP_403_FORBIDDEN)
        
        # Role-specific checks
        if user_role == "Lot Specialist" and isinstance(invoice, AdvertisementInvoice):
            return Response({"error": "You don't have permission to pay Ad Invoices."}, status=status.HTTP_403_FORBIDDEN)
        
        if user_role == "Advertising Specialist" and isinstance(invoice, LotInvoice):
            return Response({"error": "You don't have permission to pay Lot Invoices."}, status=status.HTTP_403_FORBIDDEN)
        
        # Update Invoice
        invoice.payment_method = payment_method
        invoice.has_been_paid = True
        invoice.date_of_payment = datetime.now()
        invoice.save()

        # Return Response
        if is_ad_invoice:
            serializer = AdvertisementInvoiceSerializer(invoice)
        else:
            serializer = LotInvoiceSerializer(invoice)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
