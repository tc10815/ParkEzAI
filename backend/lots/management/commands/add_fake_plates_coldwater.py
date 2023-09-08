import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from lots.models import LicensePlateReading, LPRMetadata

class Command(BaseCommand):
    help = "Add fake license plate readings for the past hour"

    def random_plate_number(self):
        letters = ''.join(random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ') for _ in range(3))
        numbers = ''.join(random.choice('0123456789') for _ in range(4))
        return letters + numbers

    def random_timestamp_last_hour(self):
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=1)
        return start_time + timedelta(
            seconds=random.randint(0, int((end_time - start_time).total_seconds())),
        )

    def readings_count(self, hour, weekday):
        if 1 <= hour <= 5:
            return random.choice([0])
        elif 6 <= hour <= 15:
            return random.choice([0, 1, 2, 3])
        elif 16 <= hour <= 23:
            return random.choice([2, 3, 4, 5]) if weekday < 5 else random.choice([3, 4, 5])

    def handle(self, *args, **kwargs):
        current_hour = datetime.now().hour
        current_weekday = datetime.now().weekday()  # 0 is Monday, 6 is Sunday

        count = self.readings_count(current_hour, current_weekday)

        for _ in range(count):
            plate_number = self.random_plate_number()
            timestamp = self.random_timestamp_last_hour()
            lpr = LPRMetadata.objects.get(name="entrance")

            reading = LicensePlateReading(lpr=lpr, plate_number=plate_number)
            reading.save()
            LicensePlateReading.objects.filter(id=reading.id).update(timestamp=timestamp)


            self.stdout.write(self.style.SUCCESS(f"Added reading {plate_number} at {timestamp}"))
