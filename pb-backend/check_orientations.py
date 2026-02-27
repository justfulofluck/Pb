import sys
from unittest.mock import MagicMock
sys.modules['yagmail'] = MagicMock()
sys.modules['razorpay'] = MagicMock()

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

for p in Product.objects.all():
    print(f"Product: {p.name}")
    print(f"  Orientation: '{p.orientation}'")
    print("-" * 20)
