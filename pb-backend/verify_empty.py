
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

count = Product.objects.count()
print(f"Product count: {count}")
