from rest_framework import serializers
from lots.models import LotMetadata
from.models import Ad

class LotMetadataSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = LotMetadata
        fields = ('id','name', 'state', 'city', 'zip', 'owner_email')

class AdSerializer(serializers.ModelSerializer):
    top_banner_image1 = serializers.ImageField(use_url=False)
    top_banner_image2 = serializers.ImageField(use_url=False)
    top_banner_image3 = serializers.ImageField(use_url=False)
    side_banner_image1 = serializers.ImageField(use_url=False)
    side_banner_image2 = serializers.ImageField(use_url=False)
    side_banner_image3 = serializers.ImageField(use_url=False)

    class Meta:
        model = Ad
        fields = '__all__'

class AdUpdateWithoutImagesSerializer(serializers.ModelSerializer):
    lot_names = serializers.ListField(child=serializers.CharField(), required=False)
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)
    top_banner_image1 = serializers.ImageField(use_url=False, required=False)
    top_banner_image2 = serializers.ImageField(use_url=False, required=False)
    top_banner_image3 = serializers.ImageField(use_url=False, required=False)
    side_banner_image1 = serializers.ImageField(use_url=False, required=False)
    side_banner_image2 = serializers.ImageField(use_url=False, required=False)
    side_banner_image3 = serializers.ImageField(use_url=False, required=False)

    class Meta:
        model = Ad
        fields = ['name', 'start_date', 'end_date', 'url', 'image_change_interval', 'lot_names',
                  'top_banner_image1', 'top_banner_image2', 'top_banner_image3',
                  'side_banner_image1', 'side_banner_image2', 'side_banner_image3']
