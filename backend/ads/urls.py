from django.urls import path
from .views import LotMetadataListView, create_ad

urlpatterns = [
    path('lot-metadata/', LotMetadataListView.as_view(), name='lot-metadata-list'),
    path('create-ad/', create_ad, name='create-ad')
]