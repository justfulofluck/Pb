import os
import django
import sys

# Setup Django environment
sys.path.append('e:/Clent/Projects/Pb/pb-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Story

print("=== LATEST STORIES ===")
stories = Story.objects.all().order_by('-id')[:5]
for s in stories:
    print(f"ID: {s.id}")
    print(f"  Media URL (Loop): {s.media_url}")
    print(f"  Full Video URL:   {s.full_video_url}")
    print(f"  Original URL:     {s.original_drive_url}")
    print("-" * 20)
