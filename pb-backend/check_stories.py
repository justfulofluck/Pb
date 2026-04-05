import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Story

print("Checking Social Stories in Database...")
stories = Story.objects.all()
if not stories:
    print("No stories found in database!")
for s in stories:
    print(f"ID: {s.id}")
    print(f"  Media URL: {s.media_url}")
    print(f"  Drive URL: {s.original_drive_url}")
    print(f"  Media Type: {s.media_type}")
    print(f"  Product ID: {s.product_id}")
    print("-" * 20)
