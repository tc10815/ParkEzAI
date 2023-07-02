from django.db import models
from django.utils import timezone
from django.utils.dateformat import format as dateformat

def image_upload_path(instance, filename):
    return f'camfeeds/{instance.folder_name}/{filename}'

class ImageUpload(models.Model):
    image = models.ImageField(upload_to=image_upload_path)
    timestamp = models.DateTimeField()
    folder_name = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.timestamp:
            filename = self.image.name
            date_code = filename.split("_")[-1].split(".")[0]
            self.timestamp = timezone.datetime.strptime(date_code, '%Y%m%d%H%M')
        super().save(*args, **kwargs)

    def __str__(self):
        return dateformat(self.timestamp, 'm-d-y H:i')
