from rest_framework import serializers
from .models import CamImage

class CamImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamImage
        fields = ('image', 'timestamp', 'camera_name', 'human_labels', 'model_labels')