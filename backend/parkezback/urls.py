from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('tickets/', include('tickets.urls')),
    path('lots/', include('lots.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
