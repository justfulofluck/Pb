import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
import django

django.setup()

from django.test import Client
from django.contrib.auth.models import User
import json

user = User.objects.get(id=3)
client = Client()
client.force_login(user)

response = client.put(
    "/api/products/27/",
    data=json.dumps(
        {
            "name": "Test Product",
            "price": "999",
            "description": "Test",
            "image": "https://example.com/test.jpg",
            "category": "1",
        }
    ),
    content_type="application/json",
)
print(f"Status: {response.status_code}")
print(f"Response: {response.content.decode()[:1000]}")
