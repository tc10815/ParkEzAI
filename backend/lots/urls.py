from django.urls import path
from .views import ImageUploadView, LatestImageView, SpecificImageView, LotMenuView, LatestJPGImageFileView, LotOwnerDashboardView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload_image/', ImageUploadView.as_view(), name='upload_image'),
    path('lot_latest/', LatestImageView.as_view(), name='lot_latest'),
    path('lot_specific', SpecificImageView.as_view(), name='lot_specific'),
    path('github_view', LatestJPGImageFileView.as_view(), name='github_view'),
    path('lot_dashboard/', LotOwnerDashboardView.as_view(), name='lot_dashboard'),
    path('menu', LotMenuView.as_view(), name='menu'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
