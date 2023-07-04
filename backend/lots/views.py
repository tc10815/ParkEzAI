import os
import json
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import LotImage

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
            lot_image = LotImage.objects.get(image__icontains=filename)
            # Delete the old file before saving the new one
            lot_image.image.delete()
        except LotImage.DoesNotExist:
            lot_image = LotImage()

        # Save the new image
        lot_image.image = uploaded_file
        lot_image.folder_name = folder_name


        # Load data from spots.json
        spots_file_path = os.path.join('models', folder_name, 'spots.json')
        with open(spots_file_path, 'r') as spots_file:
            spots_data = json.load(spots_file)
        # Get the keys from spots.json and set them in human_labels and model_labels
        keys = spots_data.keys()
        labels = {key: False for key in keys}
        lot_image.human_labels = json.dumps(labels)
        lot_image.model_labels = json.dumps(labels)

        lot_image.save()

        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)

