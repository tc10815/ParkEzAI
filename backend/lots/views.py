from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.images import ImageFile
from .models import ImageUpload
from django.core.exceptions import ValidationError

class ImageUploadView(APIView):

    def post(self, request, format=None):
        passcode = request.data.get('passcode')
        if passcode != 'lightsecurity':
            return Response({'detail': 'Invalid passcode'}, status=status.HTTP_401_UNAUTHORIZED)
        
        image = request.data.get('image')
        # Check if there are more than 5 different folders
        distinct_folder_count = ImageUpload.objects.values('folder_name').distinct().count()
        if distinct_folder_count >= 5:
            return Response({'detail': 'Image not stored, more than 5 different folders.'}, status=status.HTTP_400_BAD_REQUEST)
        # Check if there are more than 5 images overall
        image_count = ImageUpload.objects.count()
        if image_count >= 5:
            # Delete the oldest image overall
            ImageUpload.objects.order_by('timestamp').first().delete()
        # Save the new image
        image_upload = ImageUpload(image=image)
        image_upload.save()
        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)
