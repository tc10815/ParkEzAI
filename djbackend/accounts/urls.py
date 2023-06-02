from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PopulateDBView, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('populate_db/', PopulateDBView.as_view(), name='populate_db'),
    path('', include(router.urls)),

]
