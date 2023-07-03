import os
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import ImageUpload

class ImageUploadView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        # Very basic authentication
        passcode = request.data.get('passcode')
        if passcode != 'lightsecurity':
            return Response({'detail': 'Invalid passcode'}, status=status.HTTP_401_UNAUTHORIZED)

        uploaded_file = request.FILES['image']
        filename = uploaded_file.name
        folder_name, date_code = os.path.splitext(filename)[0].split("_")

        # Check if an image with the same filename already exists
        try:
            image_upload = ImageUpload.objects.get(image__icontains=filename)
            # Delete the old file before saving the new one
            image_upload.image.delete()
        except ImageUpload.DoesNotExist:
            image_upload = ImageUpload()

        # Save the new image
        image_upload.image = uploaded_file
        image_upload.folder_name = folder_name
        image_upload.save()

        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)
