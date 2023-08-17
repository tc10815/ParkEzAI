from rest_framework import generics
from rest_framework.generics import ListAPIView
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from lots.models import LotMetadata
from .models import Ad
from .serializers import LotMetadataSerializer, AdSerializer, AdUpdateWithoutImagesSerializer
import base64, os

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
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_ads_list_view(request):
    user_ads = Ad.objects.filter(user=request.user)
    serializer = AdSerializer(user_ads, many=True)
    serialized_data = serializer.data

    # Convert image paths to Base64 encoded data
    for ad in serialized_data:
        for key in ['top_banner_image1', 'top_banner_image2', 'top_banner_image3',
                    'side_banner_image1', 'side_banner_image2', 'side_banner_image3']:

            image_path = ad[key]
            with open(image_path, "rb") as image_file:
                base64_encoded = base64.b64encode(image_file.read()).decode('utf-8')
            ad[key] = f"data:image/jpeg;base64,{base64_encoded}"

    return Response(serialized_data, status=status.HTTP_200_OK)

class AdDetailView(generics.RetrieveUpdateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'advert_id'

    def get_queryset(self):
        # Ensure a user can only access their own Ad
        return self.queryset.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        print('--- Request Info ---')
        # print('Uploaded Files:', request.FILES)
        print('Method:', request.method)
        print('Headers:', request.headers)
        # print('Data:', request.data)
        print('GET Params:', request.GET)
        print('User:', request.user)
        print('Path:', request.path_info)
        print('Full URL:', request.build_absolute_uri())
        print('---------------------')

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
        
        # Convert image paths to Base64 encoded data
        for key in ['top_banner_image1', 'top_banner_image2', 'top_banner_image3',
                    'side_banner_image1', 'side_banner_image2', 'side_banner_image3']:
            
            image_path = serialized_data[key]
            if image_path:  # Ensure the image_path is not None or empty
                with open(image_path, "rb") as image_file:
                    base64_encoded = base64.b64encode(image_file.read()).decode('utf-8')
                serialized_data[key] = f"data:image/jpeg;base64,{base64_encoded}"

        # print(serialized_data)  # For debugging
        return Response(serialized_data)

    def update(self, request, *args, **kwargs):
        print('--- PUT Request Info ---')
        print('Method:', request.method)
        print('Headers:', request.headers)
        # print('Data:', request.data)
        print('GET Params:', request.GET)
        print('User:', request.user)
        print('Path:', request.path_info)
        print('Full URL:', request.build_absolute_uri())
        print('---------------------')
        
        response = super().update(request, *args, **kwargs)
        if not response.data:
            print("Serializer errors:")
        return response
    

class AdUpdateWithoutImagesView(generics.UpdateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdUpdateWithoutImagesSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'advert_id'

    def get_queryset(self):
        # Ensure a user can only access their own Ad
        return self.queryset.filter(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        old_name = instance.name
        new_name = serializer.validated_data.get('name')
        
        # Check if the name has changed
        if old_name != new_name:
            old_folder_path = os.path.join('ads', 'ad_data', str(instance.user.username), old_name)
            new_folder_path = os.path.join('ads', 'ad_data', str(instance.user.username), new_name)
            
            print('old path: ' + old_folder_path)
            print('new path: ' + new_folder_path)

            # Check if the old folder exists
            if os.path.exists(old_folder_path):
                os.rename(old_folder_path, new_folder_path)

                # Update the paths in the ImageFields
                image_path_mappings = {
                    'top_banner_image1': 'top/1/',
                    'top_banner_image2': 'top/2/',
                    'top_banner_image3': 'top/3/',
                    'side_banner_image1': 'side/1/',
                    'side_banner_image2': 'side/2/',
                    'side_banner_image3': 'side/3/'
                }

                for field_name, sub_directory in image_path_mappings.items():
                    old_image_path = getattr(instance, field_name).path
                    filename = os.path.basename(old_image_path)
                    
                    # Construct the new image path using the sub_directory
                    new_image_path = os.path.join('ads', 'ad_data', str(instance.user.username), new_name, sub_directory, filename)
                    setattr(instance, field_name, new_image_path)

        instance.name = new_name
        instance.start_date = serializer.validated_data.get('start_date')
        instance.end_date = serializer.validated_data.get('end_date')
        instance.url = serializer.validated_data.get('url')
        instance.image_change_interval = serializer.validated_data.get('image_change_interval')
        instance.save()


    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        if response.status_code == 200:  # 200 status code indicates a successful update
            instance = self.get_object()
            return Response({
                'advert_id': instance.advert_id,
                'name': instance.name
            }, status=status.HTTP_200_OK)
        
        elif response.status_code == 400:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=False)  # This will not raise an exception if invalid
            if serializer.errors:
                print("Serializer errors:", serializer.errors)  # This will print the specific errors if any

        return response  # Ensure a response is always returned for other cases

