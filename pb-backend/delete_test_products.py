
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

# Delete products created by the test script (Product 0 to Product 9)
print("Deleting test products...")
test_products = Product.objects.filter(name__startswith="Product ")
count = test_products.count()
test_products.delete()
print(f"Deleted {count} test products.")
