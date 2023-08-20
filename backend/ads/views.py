from rest_framework import generics
from rest_framework.generics import ListAPIView
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from lots.models import LotMetadata
from .models import Ad
from .serializers import LotMetadataSerializer, AdSerializer, AdUpdateWithoutImagesSerializer
import base64, os
from django.http import Http404
from shutil import rmtree 
from random import choice
from datetime import date
from django.db import models
from django.utils.cache import add_never_cache_headers

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
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data
        all_lots = serialized_data['lots']
        
        # Query the LotMetadata model using the IDs in all_lots
        lot_names = LotMetadata.objects.filter(id__in=all_lots).values_list('name', flat=True)
        
        # Convert the queryset result into a list of names
        serialized_data['lot_names'] = list(lot_names)
        
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
        
        # Handle updating the lots based on the provided lot_names
        lot_names = serializer.validated_data.get('lot_names', [])
        if lot_names:
            # Query the LotMetadata model using the provided names
            lots_to_associate = LotMetadata.objects.filter(name__in=lot_names)

            # Update the lots for the Ad instance
            instance.lots.set(lots_to_associate)

        image_fields = [
            'top_banner_image1', 'top_banner_image2', 'top_banner_image3',
            'side_banner_image1', 'side_banner_image2', 'side_banner_image3'
        ]

        for field in image_fields:
            # Check if a new image is provided in the request
            if field in serializer.validated_data:
                # Delete the current image from the drive
                current_image = getattr(instance, field)
                if current_image:
                    if os.path.exists(current_image.path):
                        os.remove(current_image.path)

                # Set the new image and the corresponding path will be automatically updated in the model
                setattr(instance, field, serializer.validated_data[field])
                
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

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_ad(request, advert_id):
    try:
        ad = Ad.objects.get(advert_id=advert_id)
    except Ad.DoesNotExist:
        raise Http404("Ad not found.")

    # Check if the authenticated user is associated with the ad
    if ad.user != request.user:
        return Response({"error": "You don't have permission to delete this ad."}, status=status.HTTP_403_FORBIDDEN)

    # Delete the associated files and folders
    folder_path = os.path.join('ads', 'ad_data', str(ad.user.username), ad.name)
    if os.path.exists(folder_path):
        rmtree(folder_path)  # This deletes the entire directory

    # Delete the ad from the database
    ad.delete()

    return Response({"success": "Ad deleted successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def serve_ad_view(request):
    
    # Get the lot id from request data
    lot_id = request.data.get('lot_id', None)
    if not lot_id:
        return Response({"error": "Lot ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Current date
    current_date = date.today()

    # Get all the ads pointing to the provided lot id
    eligible_ads = Ad.objects.filter(lots__id=lot_id)

    # print('\n\n Eligible ads based on lot (works):')
    # for x in eligible_ads:
    #     print(x.url)
    #     print(x.start_date)
    #     print(x.end_date)

    # Filter ads based on their start and end dates
    ads_within_date_range = eligible_ads.filter(
        models.Q(start_date__isnull=True, end_date__isnull=True) |
        models.Q(start_date__lte=current_date, end_date__isnull=True) |
        models.Q(start_date__isnull=True, end_date__gte=current_date) |
        models.Q(start_date__lte=current_date, end_date__gte=current_date)
    )

    # print('\n\n Ads within Date range???:')
    # for x in ads_within_date_range:
    #     print(x.url)
    #     print(x.start_date)
    #     print(x.end_date)

    users_with_ads = set(ad.user for ad in ads_within_date_range)
    selected_user = choice(list(users_with_ads))

    # Get all VALID ads for the selected user that point to the provided lot id
    # We reapply the date filter here to ensure only valid ads for the user are selected
    selected_user_ads = Ad.objects.filter(user=selected_user, lots__id=lot_id).filter(
        models.Q(start_date__isnull=True, end_date__isnull=True) |
        models.Q(start_date__lte=current_date, end_date__isnull=True) |
        models.Q(start_date__isnull=True, end_date__gte=current_date) |
        models.Q(start_date__lte=current_date, end_date__gte=current_date)
    )

    # If there's no valid ad (just as a sanity check, this shouldn't happen since you're selecting users with valid ads)
    if not selected_user_ads.exists():
        return Response({"error": "Unexpected error. No valid ads for the chosen user."}, status=status.HTTP_404_NOT_FOUND)

    # Randomly select one valid ad
    selected_ad = choice(list(selected_user_ads))
    # Increment the impressions of the ad by one
    selected_ad.increment_impressions()

    # Serialize the ad
    serializer = AdSerializer(selected_ad)

    # Convert image paths to Base64 encoded data
    serialized_data = serializer.data
    for key in ['top_banner_image1', 'top_banner_image2', 'top_banner_image3',
                'side_banner_image1', 'side_banner_image2', 'side_banner_image3']:
        image_path = serialized_data[key]
        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode('utf-8')
        serialized_data[key] = f"data:image/jpeg;base64,{base64_encoded}"
    return Response(serialized_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def increment_ad_clicks(request):
    advert_id = request.data.get('advert_id')
    if not advert_id:
        return Response({"error": "advert_id not provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        ad_instance = Ad.objects.get(advert_id=advert_id)
        ad_instance.increment_clicks()
        return Response({"success": "Click incremented successfully for the provided advert_id."}, status=status.HTTP_200_OK)
    except Ad.DoesNotExist:
        return Response({"error": "Ad with the provided advert_id does not exist."}, status=status.HTTP_404_NOT_FOUND)