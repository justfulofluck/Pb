import os
import django
import requests
from django.core.files.base import ContentFile

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category

def seed_database():
    print("Seeding database...")

    # Data from App.tsx INITIAL_PRODUCTS
    products_data = [
      {
        "name": "Super Muesli Nut & Seeds",
        "price": 510,
        "original_price": 550,
        "rating": 4.9,
        "review_count": 247,
        "is_top_rated": True,
        "category_name": "Muesli",
        "stock": 120,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlO7xgHzKyGEDOxeOScyOxN5vN6FXzx20a7SvpB5ecScwr4qW694FWHi28IthZVEaSbiDhq9U0eZ9ceBRcSATV1Ki-QuUg0XRUsfYd8o5L6LHcWQXasygvM_759LZu5o47H_FdjhQUqOtdsJr_Mdie3B1H-9h5Xm9kVjvlPMNRwwZkGgnF95HxRp2B-e3wC4qGMh-c_DtEjWEZdvmjtkysZyG-fw96D-tczHQAuR8nFehAenohxeOj74GHSHzTgUA6Ht8G4JYY93l_",
        "description": "Premium slow-roasted nut blend with high-fiber seeds and zero refined sugar.",
        "benefits": ["High Fiber", "Zero White Sugar", "Omega-3 Rich", "Vegan Friendly"],
        "nutrients": [{"label": "Protein", "value": "18g"}, {"label": "Carbs", "value": "42g"}, {"label": "Healthy Fats", "value": "22g"}, {"label": "Energy", "value": "480kcal"}]
      },
      {
        "name": "Dark Chocolate Chunky Peanut Butter",
        "price": 680,
        "rating": 4.8,
        "review_count": 119,
        "category_name": "Nut Butters",
        "is_top_rated": True,
        "stock": 85,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCP7V5MszmhehKHONysdx4EeXIINOTiNn8Vz0A5WtMtC5U15SIefWSxwqAbYTWPoft9SYq26_rh38aCtNrrmu40qNkrU6zsV5jcvcFteB5STzIIF3UGVwStHYCi0mRIqS4r4x9IHb1IJcTkZhjHhcL4XGczrd8k4eGW0u9rFGJzNFdSQZvufHuSFWCWtMiBxADQJs1dS8lMy-KwjajLg2jPe0YVJjDDmFi6sIVZlq5UWSMwylmPhJ32RySGU3TDs6QWd41oY6qPtng8",
        "description": "Hand-picked roasted peanuts blended with premium dark cocoa and protein chunks.",
        "benefits": ["No Palm Oil", "Whey Protein Added", "Gluten Free", "Dark Chocolate"],
        "nutrients": [{"label": "Protein", "value": "32g"}, {"label": "Carbs", "value": "12g"}, {"label": "Healthy Fats", "value": "48g"}, {"label": "Sugar", "value": "4g"}]
      },
      {
        "name": "High Protein Rolled Oats",
        "price": 449,
        "original_price": 520,
        "rating": 5.0,
        "review_count": 489,
        "category_name": "Oats",
        "stock": 200,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCNiD74c8_tEGvm33_Hj4lsDcPCTXKYrcvnmhVcJmDwASTO4WH7pyx_vWDolXKZRH1aacdTaCpmgdOItJGddIS5gZF6a_XVXlebwu-ohwefHDF6uX4Mjp2x1PpiFaev9waP_XSKc1UyZyqw0pRsTAQHX0bxfVYMRGpJd6A7Htf5mLGyQ2QkiA-ZCFWPOSdK8oGoGmVzjfvK9RXS5ANbLPi4N89hC-P7FQrqUrvmxuiyKxt9l8V2asTwQgQ1l29FihpAOP94VSP19PCW",
        "description": "100% whole grain oats boosted with plant protein for a sustained morning energy.",
        "benefits": ["Complex Carbs", "Slow Digestion", "Non-GMO", "No Additives"],
        "nutrients": [{"label": "Protein", "value": "14g"}, {"label": "Carbs", "value": "66g"}, {"label": "Healthy Fats", "value": "7g"}, {"label": "Fiber", "value": "11g"}]
      },
      {
        "name": "Creamy Stone-Ground Almond Butter",
        "price": 899,
        "rating": 4.7,
        "review_count": 56,
        "category_name": "Nut Butters",
        "stock": 5,
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC36Ps7aMot5-GXznDvelGditD07FcxqmsLUDCww78ftzXv6wSqu2tdIjbahIB3N5iK37NtvJQXdCOnLTNZ7hPT-YBK4JEMa53fvnzytOZqq28jFCTDOhR37W3FMPmOt7xLn4hpt1AUcBNxzkW7oPmx9ZNsB5mf_uR6_Kj1624i-WvnHZ_HQ22K2tds_wmKQECT4e8d7rzOkqE00zOTTJkipKovCEuql_GY2ctR9FpnxXxIiaali-2EAF6m3ELAHfYIZPOzZMOeud0q",
        "description": "Pure Californian almonds stone-ground into a silky smooth, heart-healthy spread.",
        "benefits": ["Heart Healthy", "Keto Friendly", "Vitamin E Rich", "Antioxidant Pack"],
        "nutrients": [{"label": "Protein", "value": "21g"}, {"label": "Carbs", "value": "10g"}, {"label": "Healthy Fats", "value": "54g"}, {"label": "Iron", "value": "4mg"}]
      }
    ]

    for item in products_data:
        category, _ = Category.objects.get_or_create(name=item.pop('category_name'))
        
        # Check if product exists
        if not Product.objects.filter(name=item['name']).exists():
            image_url = item.pop('image_url')
            # For simplicity, we are saving the URL as string since our model supports it (based on previous edits to ImageField/TextField)
            # If Model uses ImageField, we might need to change logic. 
            # Assuming Product.image is a TextField or CharField based on "Changes: Updated Product... to use TextField for images" in Walkthrough.
            
            Product.objects.create(
                category=category,
                image=image_url, 
                **item
            )
            print(f"Created: {item['name']}")
        else:
            print(f"Skipped (exists): {item['name']}")

    print("Seeding complete.")

if __name__ == '__main__':
    seed_database()
