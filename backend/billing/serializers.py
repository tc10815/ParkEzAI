from rest_framework import serializers
from .models import LotInvoice, AdvertisementInvoice, PaymentMethod, CamMetadata
from accounts.serializers import UserSerializer

class LotInvoiceSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    payment_method_name = serializers.CharField(source='payment_method.name', read_only=True)

    class Meta:
        model = LotInvoice
        fields = '__all__'

class AdvertisementInvoiceSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    payment_method_name = serializers.CharField(source='payment_method.name', read_only=True)

    class Meta:
        model = AdvertisementInvoice
        fields = '__all__'

class PaymentMethodSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PaymentMethod
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep.pop('fake_credit_card_number', None)
        return rep

class CreateLotInvoiceSerializer(serializers.ModelSerializer):
    cameras = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=CamMetadata.objects.all(),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = LotInvoice
        fields = '__all__'

class CreateAdvertisementInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvertisementInvoice
        fields = '__all__'