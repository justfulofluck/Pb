import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category

names = [
    "Super Muesli Nut & Seeds",
    "Dark Chocolate Chunky Peanut Butter",
    "High Protein Rolled Oats",
    "Creamy Stone-Ground Almond Butter"
]

products = Product.objects.filter(name__in=names)
count = products.count()
products.delete()
print(f"Successfully deleted {count} previously seeded products.")

try:
    for cat_name in ["Muesli", "Nut Butters", "Oats"]:
        try:
            cat = Category.objects.get(name=cat_name)
            if cat.product_set.count() == 0:
                cat.delete()
                print(f"Deleted empty category: {cat_name}")
        except Category.DoesNotExist:
            pass
except Exception as e:
    pass
