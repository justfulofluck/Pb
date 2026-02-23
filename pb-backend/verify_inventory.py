
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category

count_products = Product.objects.count()
count_categories = Category.objects.count()

print(f"Product count: {count_products}")
print(f"Category count: {count_categories}")
