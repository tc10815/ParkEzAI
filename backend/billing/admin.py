from django.contrib import admin
from .models import AdvertisementInvoice, LotInvoice, PaymentMethod

admin.site.register(AdvertisementInvoice)
admin.site.register(LotInvoice)
admin.site.register(PaymentMethod)
