from .models import LotImage

def get_lot_images():
    lot_images = LotImage.objects.all()
    for lot_image in lot_images:
        print(f"Image Name: {lot_image.image.name}")
        print(f"Model Labels: {lot_image.model_labels}")
