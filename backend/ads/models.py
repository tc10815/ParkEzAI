from django.db import models
from accounts.models import CustomUser
from django.core.exceptions import ValidationError

def validate_file_size(value):
    filesize = value.size

    if filesize > 500 * 1024:
        raise ValidationError("The maximum file size that can be uploaded is 500KB")
    else:
        return value


def ad_image_upload_path_top1(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/top/1/{filename}'

def ad_image_upload_path_top2(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/top/2/{filename}'

def ad_image_upload_path_top3(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/top/3/{filename}'

def ad_image_upload_path_side1(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/side/1/{filename}'

def ad_image_upload_path_side2(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/side/2/{filename}'

def ad_image_upload_path_side3(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.name}/side/3/{filename}'


class Ad(models.Model):
    advert_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name='Ad Name')
    start_date = models.DateField(verbose_name='Start Date', null=True, blank=True)
    end_date = models.DateField(verbose_name='End Date', null=True, blank=True)


    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ads')
    url = models.URLField(max_length=1024, verbose_name='Target URL')
    lots = models.ManyToManyField('lots.LotMetadata', blank=True, related_name='ads')
    
    # For counting impressions and clicks
    impressions = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)

        # Top banner images (Vertical)
    top_banner_image1 = models.ImageField(upload_to=ad_image_upload_path_top1, validators=[validate_file_size])
    top_banner_image2 = models.ImageField(upload_to=ad_image_upload_path_top2, validators=[validate_file_size])
    top_banner_image3 = models.ImageField(upload_to=ad_image_upload_path_top3, validators=[validate_file_size])

    # Side banner images (Horizontal)
    side_banner_image1 = models.ImageField(upload_to=ad_image_upload_path_side1, validators=[validate_file_size])
    side_banner_image2 = models.ImageField(upload_to=ad_image_upload_path_side2, validators=[validate_file_size])
    side_banner_image3 = models.ImageField(upload_to=ad_image_upload_path_side3, validators=[validate_file_size])

    # Interval for image change in seconds
    image_change_interval = models.PositiveIntegerField(default=10, help_text='Interval (in seconds) to switch between images')

    def __str__(self):
        return f"Ad by {self.user.username}"

    def increment_impressions(self):
        self.impressions += 1
        self.save()

    def increment_clicks(self):
        self.clicks += 1
        self.save()
