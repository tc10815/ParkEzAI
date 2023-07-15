from django.urls import path
from .views import ImageUploadView, LatestImageView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload_image/', ImageUploadView.as_view(), name='upload_image'),
    path('lot_latest/', LatestImageView.as_view(), name='lot_latest'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
