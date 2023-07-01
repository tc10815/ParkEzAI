from django.db import models

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='images/')
    folder_name = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
