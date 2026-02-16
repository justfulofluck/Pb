
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category

print("Deleting all products...")
Product.objects.all().delete()
print("All products deleted.")

print("Deleting all categories...")
Category.objects.all().delete()
print("All categories deleted.")
