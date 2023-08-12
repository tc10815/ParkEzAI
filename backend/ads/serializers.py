from rest_framework import serializers
from lots.models import LotMetadata

class LotMetadataSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = LotMetadata
        fields = ('name', 'state', 'city', 'zip', 'owner_email')