from django.db import models
from accounts.models import CustomUser
from lots.models import LotMetadata,CamMetadata

class AdvertisementInvoice(models.Model):
    date_of_invoice = models.DateTimeField(auto_now_add=True)
    date_of_payment = models.DateTimeField(null=True, blank=True)
    invoice_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    payment_method = models.ForeignKey('PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True)
    has_been_paid = models.BooleanField(default=False)
    lots_with_ads = models.ManyToManyField(LotMetadata)
    payment_due = models.PositiveIntegerField(help_text="Amount due in pennies")

    def __str__(self):
        return str(self.invoice_id)

class LotInvoice(models.Model):
    date_of_invoice = models.DateTimeField(auto_now_add=True)
    date_of_payment = models.DateTimeField(null=True, blank=True)
    invoice_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    payment_method = models.ForeignKey('PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True)
    has_been_paid = models.BooleanField(default=False)
    cameras = models.ManyToManyField(CamMetadata)
    payment_due = models.PositiveIntegerField(help_text="Amount due in pennies")

    def __str__(self):
        return str(self.invoice_id)

class PaymentMethod(models.Model):
    CREDIT_CARD_CHOICES = (
        ('VISA', 'Visa'),
        ('MASTER', 'MasterCard'),
        ('DISCOVER', 'Discover'),
    )
    
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    credit_card_type = models.CharField(max_length=10, choices=CREDIT_CARD_CHOICES)
    fake_credit_card_number = models.CharField(max_length=16)  # Assuming it's a fake number for placeholder, not for real transactions

    # Split expiration_date into two fields
    expiration_month = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 13)], help_text="Month in MM format", default=13)  # using 13 as an arbitrary value
    expiration_year = models.PositiveIntegerField(help_text="Year in YYYY format", default=0)  # using 0 as an arbitrary value

    name = models.CharField(max_length=255)
    billing_address = models.TextField()
    zip_code = models.CharField(max_length=6)
    security_code = models.CharField(max_length=4)

    def __str__(self):
        return self.name

