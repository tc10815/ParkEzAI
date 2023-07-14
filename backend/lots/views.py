import os
import datetime
import json
import cv2
from PIL import Image
import numpy as np
import torch
from torch import nn, optim
import torchvision.transforms as transforms
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from .models import LotImage

MAX_FOLDER_MB = 950

def get_mb_folder(folder_name):
    if os.path.exists(folder_name):
        return int(os.popen(f"du -sm {folder_name} | awk '{{print $1}}'").read())

# This can limit folder size by image counts instead of folder MB if you choose, this is otherwise not used
def get_file_count_folder(folder_name):
    if os.path.exists(folder_name):
        files = os.listdir(folder_name)
        return len(files)

def get_oldest_image_filename(folder_name):
    oldest_file = None
    oldest_datestamp = datetime.datetime.now()

    if os.path.exists(folder_name):
        for filename in os.listdir(folder_name):
            if filename.endswith('.jpg'):  # Adjust the file extension as per your filename format
                date_code = filename.split("_")[-1].split(".")[0]
                file_datestamp = datetime.datetime.strptime(date_code, '%Y%m%d%H%M')

                if file_datestamp < oldest_datestamp:
                    oldest_datestamp = file_datestamp
                    oldest_file = filename
    return oldest_file

def delete_file_and_lot_image(filename):
    if os.path.exists(filename):
        os.remove(filename)

    try:
        lot_image = LotImage.objects.get(image__icontains=os.path.basename(filename))
        lot_image.delete()
        print(f'~Successfully deleted {filename}')
    except LotImage.DoesNotExist:
        pass


# CNN model good at determining if car in spot, from notebook, will separate to another file eventually for organization
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        
        # Convolutional layer 1
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.relu1 = nn.ReLU()
        
        # Max pool layer
        self.pool = nn.MaxPool2d(kernel_size=2)

        # Convolutional layer 2
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.relu2 = nn.ReLU()

        # Fully connected layers
        self.fc1 = nn.Linear(64 * 32 * 32, 128)
        self.fc2 = nn.Linear(128, 2)

    def forward(self, x):
        # Convolutional layer 1
        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu1(out)

        # Max pool layer
        out = self.pool(out)

        # Convolutional layer 2
        out = self.conv2(out)
        out = self.bn2(out)
        out = self.relu2(out)

        # Max pool layer
        out = self.pool(out)

        # Flatten for fully connected layer
        out = out.view(out.size(0), -1)

        # Fully connected layer 1
        out = self.fc1(out)

        # Fully connected layer 2
        out = self.fc2(out)
        return out

# Originally in Model_Maker notebook, this preps cropped parking spaces for ML processing
transform = transforms.Compose([
    transforms.ToPILImage(),  # Convert the cv2 image to a PIL image; not in original notebook 
    transforms.Resize((128, 128)),  # Resize images to 128x128
    transforms.ToTensor(),  # Convert images to PyTorch tensor
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # Normalize pixel values in the range [-1, 1]
])

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
        save_folder = os.path.abspath('./camfeeds/' + folder_name)

        # Load data from spots.json
        spots_file_path = os.path.join('models', folder_name, 'spots.json')
        with open(spots_file_path, 'r') as spots_file:
            spots_data = json.load(spots_file)

        labels = {key: False for key in spots_data.keys()}

        # Get the keys from spots.json and set them in human_labels and model_labels
        for spot in spots_data.keys():
            x, x_w, y, y_h = spots_data[spot]
            cropped_image = cv2_image[y:y_h, x:x_w]

            #convert cropped image of spot to form usable by ML model using transform defined above
            input_tensor = transform(cropped_image)
            input_tensor = input_tensor.unsqueeze(0)  # Add a batch dimension

            model = CNN()  # Replace YourModelClass with the actual class name of your model
            model_path = os.path.join('models', folder_name, spot + '.pth')
            model.load_state_dict(torch.load(model_path)) 
            model.eval()  # Set the model to evaluation mode

            with torch.no_grad():
                output = model(input_tensor)
                _, predicted = torch.max(output, 1)

            # Access the prediction result
            prediction = predicted.item()
            if prediction == 0: labels[spot] = False

        lot_image.human_labels = json.dumps(labels)
        lot_image.model_labels = json.dumps(labels)
        lot_image.save()
        print(f'Image Count: {get_file_count_folder(save_folder)} | Folder MB: {get_mb_folder(save_folder)}  | Oldest image: {get_oldest_image_filename(save_folder)}')
        while (get_mb_folder(save_folder) > MAX_FOLDER_MB):
            delete_file_and_lot_image(get_oldest_image_filename(save_folder))
        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)

