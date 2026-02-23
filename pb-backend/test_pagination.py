
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product
from rest_framework.test import APIClient

# Clear existing
print(f"Initial count: {Product.objects.count()}")
Product.objects.all().delete()

# Create 10 products
for i in range(10):
    Product.objects.create(
        name=f"Product {i}",
        price=100 + i,
        description=f"Desc {i}",
        image="img",
        category="Test"
    )

print(f"Count after creation: {Product.objects.count()}")

# Test API response
client = APIClient()
response = client.get('/api/products/')
print(f"API Response Status: {response.status_code}")
data = response.json()

if isinstance(data, list):
    print(f"API returned list of length: {len(data)}")
else:
    print(f"API returned dict keys: {data.keys()}")
    if 'results' in data:
        print(f"Results length: {len(data['results'])}")
