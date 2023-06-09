from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PopulateDBView, UserViewSet, CreateUserView, CurrentUserView, UpdateUserView, ChangePasswordView, DeleteAccountView, UserRolesView, UserDeleteView, ChangePasswordRoleBasedView, CreateEmployeeView, InitiateUserView, LogoutView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('populate_db/', PopulateDBView.as_view(), name='populate_db'),
    path('create_user/', CreateUserView.as_view(), name='create_user'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/edit/', UpdateUserView.as_view(), name='edit-user'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('get-accounts-staff/', UserRolesView.as_view(), name='user-roles'),
    path('delete-user/', UserDeleteView.as_view(), name='delete-user'),
    path('change-password-staff/', ChangePasswordRoleBasedView.as_view(), name='change-password-role-based'),
    path('create_employee/', CreateEmployeeView.as_view(), name='create_employee'),
    path('initiate-user/', InitiateUserView.as_view(), name='initiate-user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls))
]
