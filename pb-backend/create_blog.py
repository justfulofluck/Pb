import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import BlogPost
from datetime import date

try:
    blog = BlogPost.objects.create(
        post_type="Lifestyle",
        title="10 Healthy Snacks for Your Next Road Trip",
        slug="10-healthy-snacks-road-trip",
        excerpt="Planning a road trip? Ditch the junk food and try these 10 healthy and delicious snack options that will keep your energy levels up on the go.",
        date=date.today(),
        read_time="5 min read",
        author="Health Expert",
        content=[
            "When hitting the open road, it's easy to rely on convenience store snacks filled with sugar and empty calories. However, preparing a few healthy options can make a huge difference in your energy levels and overall trip satisfaction.",
            "Here are our top 10 picks for healthy road trip snacks: \n1. Roasted chickpeas\n2. Apple slices with almond butter\n3. Trail mix with dark chocolate\n4. Hard-boiled eggs\n5. Edamame\n6. Protein balls\n7. Carrot sticks with hummus\n8. Greek yogurt parfaits\n9. Air-popped popcorn\n10. Fresh grapes",
            "Remember to pack a cooler with ice packs to keep perishables fresh, and stay hydrated by bringing plenty of water!"
        ],
        tags=["Healthy Eating", "Travel", "Snacks"],
        is_active=True,
        subtitle="Fuel your journey with nutrition",
        intro_heading="Why Healthy Snacks Matter on the Road",
        featured_quote="A healthy outside starts from the inside, even when you're traveling.",
        author_role="Nutritionist",
        facts_list=[
            "Healthy snacks improve focus while driving.",
            "Balanced snacks prevent sugar crashes."
        ],
        key_points=[
            "Plan ahead and prep snacks at home.",
            "Choose snacks high in protein and fiber.",
            "Stay hydrated."
        ],
        health_benefits=[
            "Sustained energy",
            "Improved digestion",
            "Better mood"
        ],
        usage_recipes=[
            "Energy Bites: Mix oats, peanut butter, honey, and chocolate chips. Roll into balls."
        ]
    )
    print("Successfully created blog post:", blog.title)
except Exception as e:
    print("Error:", e)
