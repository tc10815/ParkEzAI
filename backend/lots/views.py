from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.images import ImageFile
from .models import ImageUpload
from django.core.exceptions import ValidationError

class ImageUploadView(APIView):

    def post(self, request, format=None):
        image = request.data.get('image')
        folder_name = request.data.get('folder_name')
        # Check if there are more than 5 different folders
        distinct_folder_count = ImageUpload.objects.values('folder_name').distinct().count()
        if distinct_folder_count >= 5 and not ImageUpload.objects.filter(folder_name=folder_name).exists():
            return Response({'detail': 'Image not stored, more than 5 different folders.'}, status=400)
        # Check if there are more than 5 images in the folder
        image_count_in_folder = ImageUpload.objects.filter(folder_name=folder_name).count()
        if image_count_in_folder >= 5:
            # Delete the oldest image in the folder
            ImageUpload.objects.filter(folder_name=folder_name).order_by('timestamp').first().delete()
        # Save the new image
        image_upload = ImageUpload(image=image, folder_name=folder_name)
        image_upload.save()
        return Response({'detail': 'Image successfully stored.'}, status=201)
