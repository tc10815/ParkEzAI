from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PopulateDBView, UserViewSet, CreateUserView, CurrentUserView, UpdateUserView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('populate_db/', PopulateDBView.as_view(), name='populate_db'),
    path('create_user/', CreateUserView.as_view(), name='create_user'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/edit/', UpdateUserView.as_view(), name='edit-user'),
    path('', include(router.urls)),
]
