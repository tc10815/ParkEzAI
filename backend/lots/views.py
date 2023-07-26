import os, io, datetime, torch, json, cv2
from PIL import Image, ImageDraw, ImageFont    
import numpy as np
from torch import nn, optim
import torchvision.transforms as transforms
from django.http import FileResponse, JsonResponse
from django.views.generic import ListView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.core.files.storage import default_storage
from django.conf import settings

from .models import LotImage, LotMetadata

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
        self.conv1 = nn.Conv2d(3, 64, kernel_size=3, stride=1, padding=1)  
        self.bn1 = nn.BatchNorm2d(64)
        self.relu1 = nn.ReLU()

        # Convolutional layer 2
        self.conv2 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        self.relu2 = nn.ReLU()
        
        # Convolutional layer 3
        self.conv3 = nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(256)
        self.relu3 = nn.ReLU()

        # Convolutional layer 4
        self.conv4 = nn.Conv2d(256, 512, kernel_size=3, stride=1, padding=1)
        self.bn4 = nn.BatchNorm2d(512)
        self.relu4 = nn.ReLU()

        # Convolutional layer 5
        self.conv5 = nn.Conv2d(512, 512, kernel_size=3, stride=1, padding=1)
        self.bn5 = nn.BatchNorm2d(512)
        self.relu5 = nn.ReLU()

        # Max pool layer
        self.pool = nn.MaxPool2d(kernel_size=2)

        # Dropout layer
        self.dropout = nn.Dropout(p=0.5)

        # Fully connected layers
        self.fc1 = nn.Linear(512 * 8 * 8, 1024)
        self.fc2 = nn.Linear(1024, 512)
        self.fc3 = nn.Linear(512, 2)

    def forward(self, x):
        # Convolutional layer 1
        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu1(out)
        out = self.pool(out)

        # Convolutional layer 2
        out = self.conv2(out)
        out = self.bn2(out)
        out = self.relu2(out)
        out = self.pool(out)

        # Convolutional layer 3
        out = self.conv3(out)
        out = self.bn3(out)
        out = self.relu3(out)
        out = self.pool(out)

        # Convolutional layer 4
        out = self.conv4(out)
        out = self.bn4(out)
        out = self.relu4(out)
        out = self.pool(out)

        # Convolutional layer 5
        out = self.conv5(out)
        out = self.bn5(out)
        out = self.relu5(out)
        out = self.pool(out)

        # Flatten for fully connected layer
        out = out.view(out.size(0), -1)

        # Fully connected layer 1
        out = self.fc1(out)
        out = self.dropout(out)

        # Fully connected layer 2
        out = self.fc2(out)
        out = self.dropout(out)

        # Fully connected layer 3
        out = self.fc3(out)

        return out


# Originally in Model_Maker notebook, this preps cropped parking spaces for ML processing
transform = transforms.Compose([
    transforms.Resize((256, 256)),  # Resize to 256x256
    transforms.ToTensor(),  # Convert to PyTorch tensor
    transforms.Normalize((0.5,0.5,0.5,), (0.5,0.5,0.5,))  # Normalize pixel values in the range [-1, 1]
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
            cropped_image = pil_image.crop((x, y, x_w, y_h))

            #convert cropped image of spot to form usable by ML model using transform defined above
            input_tensor = transform(cropped_image)
            input_tensor = input_tensor.unsqueeze(0)  # Add a batch dimension

            model = CNN()  # Replace YourModelClass with the actual class name of your model
            model_path = os.path.join('models', folder_name, spot + '.pth')

            #Code for development env
            model_state_dict = torch.load(model_path, map_location=torch.device('cpu'))
            model.load_state_dict(model_state_dict)

            #Code for production env
            # model.load_state_dict(torch.load(model_path)) 

            model.eval()  # Set the model to evaluation mode

            with torch.no_grad():
                output = model(input_tensor)
                _, predicted = torch.max(output, 1)

            # Access the prediction result
            prediction = predicted.item()
            if prediction == 0: labels[spot] = True

        lot_image.human_labels = json.dumps(labels)
        lot_image.model_labels = json.dumps(labels)
        lot_image.save()
        print(f'Image Count: {get_file_count_folder(save_folder)} | Folder MB: {get_mb_folder(save_folder)}  | Oldest image: {get_oldest_image_filename(save_folder)}')
        while (get_mb_folder(save_folder) > MAX_FOLDER_MB):
            delete_file_and_lot_image(get_oldest_image_filename(save_folder))
        return Response({'detail': 'Image successfully stored.'}, status=status.HTTP_201_CREATED)


class LatestImageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        camera_name = request.GET.get('camera')
        if not camera_name:
            return Response({'detail': 'Camera not specified.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lot_image = LotImage.objects.filter(folder_name=camera_name).latest('timestamp')
        except LotImage.DoesNotExist:
            return Response({'detail': 'No images found for this camera.'}, status=status.HTTP_404_NOT_FOUND)

        # Get the URL of the image file
        image_url = default_storage.url(lot_image.image.name)

        # Get the image name part of the previous image
        try:
            previous_image = LotImage.objects.filter(folder_name=camera_name, timestamp__lt=lot_image.timestamp).latest('timestamp')
            previous_image_name_part = previous_image.image.name.split('_')[-1].replace('.jpg', '')
        except LotImage.DoesNotExist:
            # If there is no previous imag;,e, use the current image name part
            previous_image_name_part = lot_image.image.name.split('_')[-1].replace('.jpg', '')

        spots_path = os.path.join('models', camera_name, 'spots.json')
        bestspots_path = os.path.join('models', camera_name, 'bestspots.json')
        
        # Load the contents of the JSON files
        with open(spots_path, 'r') as spots_file:
            spots_data = json.load(spots_file)
        with open(bestspots_path, 'r') as bestspots_file:
            bestspots_data = json.load(bestspots_file)


        human_labels = json.loads(lot_image.human_labels)
        model_labels = json.loads(lot_image.model_labels)
        # Construct the response data
        response_data = {
            'image_url': image_url,
            'timestamp': lot_image.timestamp,
            'human_labels': human_labels,
            'model_labels': model_labels,
            'previous_image_name_part': previous_image_name_part,
            'spots': spots_data,
            'bestspots': bestspots_data,
        }

        return Response(response_data)


class SpecificImageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        camera_name = request.GET.get('camera')
        image_name_part = request.GET.get('image')

        if not camera_name or not image_name_part:
            return Response({'detail': 'Camera or image not specified.'}, status=status.HTTP_400_BAD_REQUEST)

        image_name = f"camfeeds/{camera_name}/{camera_name}_{image_name_part}.jpg"

        try:
            lot_image = LotImage.objects.get(image__icontains=image_name)
        except LotImage.DoesNotExist:
            return Response({'detail': 'No images found for this camera.'}, status=status.HTTP_404_NOT_FOUND)

        # Get the URL of the image file
        image_url = default_storage.url(lot_image.image.name)

        # Find the previous and next images by timestamp
        previous_image = LotImage.objects.filter(folder_name=camera_name, timestamp__lt=lot_image.timestamp).order_by('-timestamp').first()
        next_image = LotImage.objects.filter(folder_name=camera_name, timestamp__gt=lot_image.timestamp).order_by('timestamp').first()

        # Extract the image name part from the previous and next image names
        previous_image_name_part = previous_image.image.name.split('_')[-1].split('.')[0] if previous_image else image_name_part
        next_image_name_part = next_image.image.name.split('_')[-1].split('.')[0] if next_image else image_name_part

        spots_path = os.path.join('models', camera_name, 'spots.json')
        bestspots_path = os.path.join('models', camera_name, 'bestspots.json')

        # Load the contents of the JSON files
        with open(spots_path, 'r') as spots_file:
            spots_data = json.load(spots_file)
        with open(bestspots_path, 'r') as bestspots_file:
            bestspots_data = json.load(bestspots_file)

        human_labels = json.loads(lot_image.human_labels)
        model_labels = json.loads(lot_image.model_labels)
        # Construct the response data
        response_data = {
            'image_url': image_url,
            'timestamp': lot_image.timestamp,
            'human_labels': human_labels,
            'model_labels': model_labels,
            'previous_image_name_part': previous_image_name_part,
            'next_image_name_part': next_image_name_part,
            'spots': spots_data,
            'bestspots': bestspots_data,
        }

        return Response(response_data)

class LotMenuView(ListView):
    model = LotMetadata

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.values('id', 'name', 'gps_coordinates', 'state', 'zip', 'city')

    def render_to_response(self, context, **response_kwargs):
        # We override this method to change the output format to JSON.
        return JsonResponse(list(context['object_list']), safe=False)

class LatestJPGImageFileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        camera_name = request.GET.get('camera')
        if not camera_name:
            return Response({'detail': 'Camera not specified.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filter by '.jpg' extension
            lot_image = LotImage.objects.filter(folder_name=camera_name, image__endswith='.jpg').latest('timestamp')
        except LotImage.DoesNotExist:
            return Response({'detail': 'No JPG images found for this camera.'}, status=status.HTTP_404_NOT_FOUND)

        # Get the path of the image file
        image_path = os.path.join(settings.MEDIA_ROOT, lot_image.image.name)

        # Open the image file and create an Image object
        image = Image.open(image_path)

        human_labels = json.loads(lot_image.human_labels)

        spots_path = os.path.join('models', camera_name, 'spots_view.json')
        with open(spots_path, 'r') as spots_file:
            spots_data_view = json.load(spots_file)

        # Resize the image
        base_width = 900
        w_percent = (base_width / float(image.size[0]))
        h_size = int((float(image.size[1]) * float(w_percent)))
        image = image.resize((base_width, h_size), Image.LANCZOS)

        # Create a draw object
        draw = ImageDraw.Draw(image)

        # Define the text and position
        text = lot_image.timestamp.strftime("%Y-%m-%d %H:%M:%S")  # Change the format as needed
        text_position = (image.width - 450, image.height - 50)  # Change the position as needed

        # Define the font (change the font file and size as needed)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)

        # Draw the text on the image
        draw.text(text_position, text, font=font)

        # Draw a rectangle for each spot in the spots_data_view
        for spot, coordinates in spots_data_view.items():
            x1, y1, x2, y2 = coordinates
            correct_coordinates = [x1, x2, y1, y2]             
            correct_coordinates = [x1 * w_percent, x2 * w_percent, y1 * w_percent, y2 * w_percent]  # Swap y1 and y2 and scale coordinates

            # Choose the color of the rectangle based on the value in human_labels
            color = 'red' if human_labels.get(spot, False) else 'green'

            draw.rectangle(correct_coordinates, outline=color, width=5)

        # Save the image to a BytesIO object
        byte_arr = io.BytesIO()
        image.save(byte_arr, format='JPEG')
        byte_arr.seek(0)  # seek back to the start after saving

        # Create a response
        response = FileResponse(byte_arr, content_type='image/jpeg')

        # Add anti-caching headers
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'

        # Return the image data as a response
        return response