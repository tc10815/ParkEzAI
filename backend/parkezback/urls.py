from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('tickets/', include('tickets.urls')),
    path('lots/', include('lots.urls')),
]
