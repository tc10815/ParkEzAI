from rest_framework import serializers
from lots.models import LotMetadata
from.models import Ad

class LotMetadataSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = LotMetadata
        fields = ('id','name', 'state', 'city', 'zip', 'owner_email')

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = '__all__'