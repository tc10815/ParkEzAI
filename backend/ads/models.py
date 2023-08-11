from django.db import models
from accounts.models import CustomUser

def ad_image_upload_path_top1(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.advert_id}/top/1/{filename}'

def ad_image_upload_path_top2(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.advert_id}/top/2/{filename}'

def ad_image_upload_path_top3(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.advert_id}/top/3/{filename}'

def ad_image_upload_path_side1(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.advert_id}/side/1/{filename}'

def ad_image_upload_path_side2(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.advert_id}/side/2/{filename}'

def ad_image_upload_path_side3(instance, filename):
    return f'ads/ad_data/{instance.user.username}/{instance.adver_id}/side/3/{filename}'


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
    top_banner_image1 = models.ImageField(upload_to=ad_image_upload_path_top1)
    top_banner_image2 = models.ImageField(upload_to=ad_image_upload_path_top2)
    top_banner_image3 = models.ImageField(upload_to=ad_image_upload_path_top3)

    # Side banner images (Horizontal)
    side_banner_image1 = models.ImageField(upload_to=ad_image_upload_path_side1)
    side_banner_image2 = models.ImageField(upload_to=ad_image_upload_path_side2)
    side_banner_image3 = models.ImageField(upload_to=ad_image_upload_path_side3)

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
