from rest_framework import generics
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from lots.models import LotMetadata
from .models import Ad
from .serializers import LotMetadataSerializer, AdSerializer
import os

def get_directory_size(directory):
    total = 0
    try:
        for entry in os.scandir(directory):
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_directory_size(entry.path)
    except NotADirectoryError:
        pass
    except PermissionError:
        pass
    return total

class LotMetadataListView(generics.ListAPIView):
    queryset = LotMetadata.objects.all()
    serializer_class = LotMetadataSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ad(request):
    if request.method == 'POST':
        dir_size = get_directory_size('ads/ad_data/')
        if dir_size > 1 * 1024 * 1024 * 1024:  # 1GB
            return Response({"error": "Maximum storage limit exceeded."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['user'] = request.user.pk
        serializer = AdSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
