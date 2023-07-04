from django.contrib import admin
from .models import LotImage

class ImageUploadAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'timestamp', 'folder_name')
    list_filter = ('folder_name',)

admin.site.register(LotImage, ImageUploadAdmin)
