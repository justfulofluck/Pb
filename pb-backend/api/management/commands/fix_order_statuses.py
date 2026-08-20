from django.core.management.base import BaseCommand
from api.models import Order


class Command(BaseCommand):
    help = "Fix existing order status values to match STATUS_CHOICES"

    def handle(self, *args, **options):
        pending_fixed = Order.objects.filter(status="Pending").update(status="PENDING")
        self.stdout.write(f"Fixed 'Pending' → 'PENDING': {pending_fixed} orders")

        processing_fixed = Order.objects.filter(status="Processing").update(status="PAID")
        self.stdout.write(f"Fixed 'Processing' → 'PAID': {processing_fixed} orders")

        total = Order.objects.count()
        valid = Order.objects.filter(status__in=["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]).count()
        self.stdout.write(f"Total orders: {total} | Valid statuses: {valid}")
