import os
import sys
import django

sys.path.append('/home/bhavan/Public/Pynatic/Pb/pb-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

detailed_data = [
    { "n": "Energy (kcal)", "v100": "527", "v32": "168.6", "r": "- -", "b": True },
    { "n": "Total Fat (g)", "v100": "35 g", "v32": "11.2 g", "r": "45 %", "b": True },
    { "n": "Saturated Fat (g)", "v100": "5.9 g", "v32": "1.88 g", "r": "30 %", "i": True },
    { "n": "Trans Fat (g)", "v100": "0 g", "v32": "- -", "r": "- -", "i": True },
    { "n": "Polyunsaturated Fat (g)", "v100": "10 g", "v32": "3.2 g", "r": "- -", "i": True },
    { "n": "Monounsaturated Fat (g)", "v100": "19.1 g", "v32": "6.11 g", "r": "- -", "i": True },
    { "n": "Cholesterol (mg)", "v100": "0 mg", "v32": "- -", "r": "- -", "b": True },
    { "n": "Sodium (mg)", "v100": "45 mg", "v32": "14.4 mg", "r": "2 %", "b": True },
    { "n": "Total Carbohydrate (g)", "v100": "14 g", "v32": "4.48 g", "r": "5 %", "b": True },
    { "n": "Dietary Fiber (g)", "v100": "10 g", "v32": "3.2 g", "r": "36 %", "i": True },
    { "n": "Natural Sugar (g)", "v100": "5.9 g", "v32": "1.5 g", "r": "- -", "i": True },
    { "n": "Added Sugar (g)", "v100": "0 g", "v32": "- -", "r": "- -", "i": True },
    { "n": "Sugar (g)", "v100": "5.9 g", "v32": "1.5 g", "r": "- -", "i": True },
    { "n": "Protein (g)", "v100": "36 g", "v32": "11.52 g", "r": "72 %", "b": True },
    { "n": "Calcium (mg)", "v100": "35 mg", "v32": "11.2 mg", "r": "3 %", "b": False },
    { "n": "Iron (mg)", "v100": "0.5 mg", "v32": "0.16 mg", "r": "3 %", "b": False },
    { "n": "Potassium (mg)", "v100": "323 mg", "v32": "103.36 mg", "r": "7 %", "b": False }
]

# Searching for Natural Crunchy Peanut Butter
products = Product.objects.filter(name__icontains="Natural Crunchy Peanut Butter")
if products.exists():
    for p in products:
        p.detailed_nutrition = detailed_data
        p.save()
        print(f"Updated {p.name}")
else:
    print("Product not found. Printing all products to see exact name:")
    for p in Product.objects.all():
        print(p.name)
