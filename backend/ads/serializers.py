from rest_framework import serializers
from lots.models import LotMetadata

class LotMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LotMetadata
        fields = ('name', 'state', 'city', 'zip')
