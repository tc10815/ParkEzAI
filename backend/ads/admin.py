from django.contrib import admin
from .models import Ad

class AdAdmin(admin.ModelAdmin):
    list_display = ('user', 'url', 'image_change_interval', 'impressions', 'clicks')
    list_filter = ('user',)
    search_fields = ('user__username',)

admin.site.register(Ad, AdAdmin)
