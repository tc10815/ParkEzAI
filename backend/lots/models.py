from django.db import models
from django.utils import timezone
from django.utils.dateformat import format as dateformat
from django.core.files.storage import default_storage
from accounts.models import CustomUser

def image_upload_path(instance, filename):
    return f'camfeeds/{instance.camera_name}/{filename}'

class CamImage(models.Model):
    image = models.ImageField(upload_to=image_upload_path)
    timestamp = models.DateTimeField()
    camera_name = models.CharField(max_length=255)
    human_labels = models.TextField(blank=True, null=True)
    model_labels = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.timestamp:
            filename = self.image.name
            date_code = filename.split("_")[-1].split(".")[0]
            naive_datetime = timezone.datetime.strptime(date_code, '%Y%m%d%H%M')
            self.timestamp = timezone.make_aware(naive_datetime)
        super().save(*args, **kwargs)


    def __str__(self):
        return dateformat(self.timestamp, 'm-d-y H:i')

    def delete(self, using=None, keep_parents=False):
        # Delete the old file before saving the new one
        default_storage.delete(self.image.name)
        super().delete(using=using, keep_parents=keep_parents)

class LotMetadata(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    gps_coordinates = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=2, null=True, blank=True)
    zip = models.CharField(max_length=5, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name
    
class CamMetadata(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    lot = models.ForeignKey(LotMetadata, on_delete=models.CASCADE)

    def __str__(self):
        return self.name