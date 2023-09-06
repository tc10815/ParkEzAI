from django.contrib import admin
from .models import CamImage, LotMetadata, CamMetadata, LPRMetadata, LicensePlateReading

class ImageUploadAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'timestamp', 'camera_name')
    list_filter = ('camera_name',)

admin.site.register(CamImage, ImageUploadAdmin)
admin.site.register(LotMetadata)
admin.site.register(CamMetadata)

admin.site.register(LPRMetadata)
admin.site.register(LicensePlateReading)