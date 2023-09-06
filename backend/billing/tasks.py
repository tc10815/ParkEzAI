from accounts.models import CustomUser, Role
from lots.models import LotMetadata, CamMetadata
from ads.models import Ad
from .models import LotInvoice, AdvertisementInvoice
from django.utils import timezone
from django.conf import settings
import subprocess
from decouple import config

SMTP_PASSWORD = config('SMTP_PASSWORD')

def send_invoice_email(recipient_email, subject, body):
    cmd = [
        'swaks', 
        '--to', 'twcookson@gmail.com', #recipient_email in true version, but sent to me since those are fake emails 
        '--from', 'billing@plan6.com',
        '--server', 'plan6.com:25', 
        '--auth', 'LOGIN', 
        '--tls', 
        '--auth-user', 'billing', 
        '--auth-password', SMTP_PASSWORD,
        '--header', f'Subject: {subject}', 
        '--body', body, 
        '--h-cc', 'twcookson@gmail.com'  # Using CC here. If you prefer BCC, replace '--h-cc' with '--h-bcc'
    ]
    subprocess.run(cmd)

def generate_monthly_invoices():
    base_lot_price = 20
    per_camera_price = 20

    lot_operator_role = Role.objects.get(role_name="Lot Operator")
    lot_operators = CustomUser.objects.filter(role=lot_operator_role)

    for operator in lot_operators:
        # Building the invoice description string for later
        description_lines = [
            f"Invoice for {operator.first_name} {operator.last_name}\n",
            f"Date: {timezone.localtime(timezone.now()).strftime('%Y-%m-%d')}\n",
            f"Email: {operator.email}\n",
            "Cameras in service:"
        ]

        lots = LotMetadata.objects.filter(owner=operator)
        total_cameras = 0
        camera_list = []  # A list to hold the cameras for this operator

        for lot in lots:
            description_lines.append(f"\tLot id {lot.id}:\n")
            cameras = CamMetadata.objects.filter(lot=lot)

            for camera in cameras:
                description_lines.append(f"\t\tCamera: {camera.name}\n")
                total_cameras += 1
                camera_list.append(camera)

        final_invoice_price = base_lot_price + (total_cameras * per_camera_price)
        description_lines.extend([
            f"Base price: ${base_lot_price}",
            f"Total cameras: {total_cameras} at ${per_camera_price} = ${per_camera_price * total_cameras}\n",
            f"Invoice total: ${final_invoice_price}"
        ])

        # Create a new LotInvoice instance
        invoice = LotInvoice(
            customer=operator,
            payment_due=final_invoice_price * 100,  # Assuming this is in cents (pennies)
            description="\n".join(description_lines),
            is_monthly_invoice=True
        )
        invoice.save()

        # After saving the invoice, we can add the many-to-many relations
        invoice.cameras.set(camera_list)
        invoice.save()
        email_subject = "Your Monthly Lot Invoice"
        send_invoice_email(operator.email, email_subject, "\n".join(description_lines))

        # Here you can add any additional operations, for example, sending this invoice by email to the user

    # Change prices here to affect billing
    base_ad_price = 10
    per_ad_price = 10

    advertiser_role = Role.objects.get(role_name="Advertiser")
    advertisers = CustomUser.objects.filter(role=advertiser_role)

    for advertiser in advertisers:
        # Building the invoice description string for later
        description_lines = [
            f"Invoice for {advertiser.first_name} {advertiser.last_name}\n",
            f"Date: {timezone.localtime(timezone.now()).strftime('%Y-%m-%d')}\n",
            f"Email: {advertiser.email}\n\n",
            "Ads in service:\n"
        ]

        ads = Ad.objects.filter(user=advertiser)
        unique_lot_set = set()  # A set to hold the unique lots for this advertiser's ads

        for ad in ads:
            description_lines.append(f"\tAd: {ad.name}\n")
            
            for lot in ad.lots.all():  # Iterating over each lot associated with the current ad
                unique_lot_set.add(lot)
                description_lines.append(f"\t\tLot: {lot.name}\n")

        final_invoice_price = base_ad_price + (len(ads) * per_ad_price)
        description_lines.extend([
            f"\nBase price: ${base_ad_price}",
            f"Total ads: {len(ads)} at ${per_ad_price} = ${len(ads) * per_ad_price}\n",
            f"Invoice total: ${final_invoice_price}\n"
        ])

        # Create a new AdvertisementInvoice instance
        ad_invoice = AdvertisementInvoice(
            customer=advertiser,
            payment_due=final_invoice_price * 100, 
            description="".join(description_lines),
            is_monthly_invoice=True
        )
        ad_invoice.save()

        # After saving the ad_invoice, we can add the many-to-many relations
        ad_invoice.lots_with_ads.set(unique_lot_set)  # Using the set directly with set() function
        ad_invoice.save()
        email_subject = "Your Monthly Advertisement Invoice"
        send_invoice_email(advertiser.email, email_subject, "".join(description_lines))
