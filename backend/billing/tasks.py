from accounts.models import CustomUser, Role
from lots.models import LotMetadata, CamMetadata
from ads.models import Ad
from django.utils import timezone

def generate_monthly_invoices():
    # Change prices here to affect billing
    base_lot_price = 20
    per_camera_price = 20

    base_ad_price = 10
    per_ad_price = 10

    # Get roles for "Lot Operator" and "Advertiser"
    lot_operator_role = Role.objects.get(role_name="Lot Operator")
    advertiser_role = Role.objects.get(role_name="Advertiser")
    
    # Fetch all users with "Lot Operator" role
    lot_operators = CustomUser.objects.filter(role=lot_operator_role)
    for operator in lot_operators:
        print("Invoice for " + operator.first_name + " " + operator.last_name)
        print("Date " + timezone.localtime(timezone.now()).strftime('%Y-%m-%d %H:%M:%S'))
        print(f"Email: {operator.email}")
        lots = LotMetadata.objects.filter(owner=operator)
        print("\nCameras in service:")
        total_cameras = 0
        for lot in lots:
            print('  Lot id ' + lot.id + ':')
            cameras = CamMetadata.objects.filter(lot=lot)
            for camera in cameras:
                print(f"  - Camera: {camera.name}")
                total_cameras = total_cameras + 1
        print(f'\n Total cameras {total_cameras} at ${per_camera_price} = ${per_camera_price * total_cameras}')
        final_invoice_price = base_lot_price + (total_cameras* per_camera_price);
        print(f'Invoice total:\nPer camera fee (${(per_camera_price * total_cameras)}) + base rate: (${base_lot_price}) = ${final_invoice_price}')
        

    # Fetch all users with "Advertiser" role
    advertisers = CustomUser.objects.filter(role=advertiser_role)
    for advertiser in advertisers:
        print("Invoice for " + advertiser.first_name + " " + advertiser.last_name)
        print("Date " + timezone.localtime(timezone.now()).strftime('%Y-%m-%d %H:%M:%S'))
        print(f"Email: {advertiser.email}")        # Fetch all ads associated with this advertiser
        ads = Ad.objects.filter(user=advertiser)
        print("\nAds in service:")
        for ad in ads:
            print(f"  - Ad: {ad.name}")
        print(f'\n Total ad {len(ads)} at ${per_ad_price} = ${len(ads) * per_ad_price}')
        final_invoice_price = base_ad_price + (len(ads) * per_ad_price)
        print(f'Invoice total is Per ad fee (${len(ads) * per_ad_price}) + base rate: (${base_ad_price}): ${final_invoice_price}')
