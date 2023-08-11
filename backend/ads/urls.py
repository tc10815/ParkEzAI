from django.urls import path
from .views import LotMetadataListView

urlpatterns = [
    path('lot-metadata/', LotMetadataListView.as_view(), name='lot-metadata-list'),
]