from rest_framework import serializers
from .models import CamImage, LicensePlateReading, LPRMetadata

class CamImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamImage
        fields = ('image', 'timestamp', 'camera_name', 'human_labels', 'model_labels')

class LicensePlateReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicensePlateReading
        fields = ('lpr', 'plate_number','timestamp')

class LPRMetadataNoPasscodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LPRMetadata
        exclude = ('passcode',)



# class LicensePlateReading(models.Model):
#     lpr = models.ForeignKey(LPRMetadata, on_delete=models.CASCADE)
#     timestamp = models.DateTimeField(auto_now_add=True)
#     plate_number = models.CharField(max_length=10)  # Adjust max_length as per your region's plate format

#     def __str__(self):
#         return f"{self.plate_number} at {self.timestamp}"