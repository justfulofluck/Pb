
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import BlogPost

print("Deleting all blog posts...")
BlogPost.objects.all().delete()
print("All blog posts deleted.")
