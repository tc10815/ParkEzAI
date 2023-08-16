from django.urls import path
from .views import LotMetadataListView, create_ad, user_ads_list_view, AdDetailView, AdUpdateWithoutImagesView

urlpatterns = [
    path('lot-metadata/', LotMetadataListView.as_view(), name='lot-metadata-list'),
    path('create-ad/', create_ad, name='create-ad'),
    path('user-ads/', user_ads_list_view, name='user-ads-list'),
    path('edit/<int:advert_id>/', AdDetailView.as_view(), name='ad_detail'),
    path('edit_without_images/<int:advert_id>/', AdUpdateWithoutImagesView.as_view(), name='ad-edit-without-images'),
]