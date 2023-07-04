import os
import json
import cv2
from PIL import Image
import numpy as np
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from .models import LotImage

def process_images(self, output_folder):
    for img_file in self.images:
        img_path = os.path.join(self.folder, img_file)
        image = cv2.imread(img_path)
        img_labels = self.labels[img_file]
        
        for spot, is_occupied in img_labels.items():
            x, x_w, y, y_h = self.parking_spots[spot]
            cropped_image = image[y:y_h, x:x_w]
            status = 'occupied' if is_occupied else 'vacant'
            output_path = os.path.join(output_folder, spot, status)
            os.makedirs(output_path, exist_ok=True)
            output_filename = os.path.join(output_path, img_file)
            cv2.imwrite(output_filename, cropped_image)

class ImageUploadView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        # Very basic authentication
        passcode = request.data.get('passcode')
        if passcode != 'lightsecurity':
            return Response({'detail': 'Invalid passcode'}, status=status.HTTP_401_UNAUTHORIZED)

        uploaded_file = request.FILES['image']

        # Convert django.core.files.uploadedfile.InMemoryUploadedFile to a cv2 image for ML processing
        pil_image = Image.open(uploaded_file)
        np_image = np.array(pil_image)
        cv2_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)        
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
        for spot in spots_data.keys():
            x, x_w, y, y_h = spots_data[spot]
            cropped_image = cv2_image[y:y_h, x:x_w]
            output_path = os.path.join(folder_name, spot)
            os.makedirs(output_path, exist_ok=True)
            output_filename = os.path.join(output_path, filename)
            cv2.imwrite(output_filename, cropped_image)


        labels = {key: False for key in spots_data.keys()}
        lot_image.human_labels = json.dumps(labels)
        lot_image.model_labels = json.dumps(labels)

        lot_image.save()

        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)

