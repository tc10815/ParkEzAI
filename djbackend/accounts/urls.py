from django.urls import path
from .views import PopulateDBView

urlpatterns = [
    path('populate_db/', PopulateDBView.as_view(), name='populate_db'),
]
