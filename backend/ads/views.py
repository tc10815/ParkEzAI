from rest_framework import generics
from lots.models import LotMetadata
from .serializers import LotMetadataSerializer

class LotMetadataListView(generics.ListAPIView):
    queryset = LotMetadata.objects.all()
    serializer_class = LotMetadataSerializer
