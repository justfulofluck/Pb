import requests
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Configuration
BASE_URL = 'http://localhost:8000'

def test_login_flow():
    # 1. Create temp superuser
    username = 'temp_admin_2'
    password = 'TestPass123!'
    try:
        user = User.objects.get(username=username)
        user.delete()
    except User.DoesNotExist:
        pass
    
    user = User.objects.create_superuser(username, 'temp2@example.com', password)
    print(f"Created temp superuser: {username}")

    # 2. Login
    login_url = f"{BASE_URL}/api/token/"
    response = requests.post(login_url, json={'username': username, 'password': password})
    
    if response.status_code != 200:
        print(f"Login Failed: {response.text}")
        user.delete()
        return

    tokens = response.json()
    access_token = tokens['access']
    print(f"Login Successful.")

    # 3. Fetch Me
    headers = {'Authorization': f"Bearer {access_token}"}
    me_response = requests.get(f"{BASE_URL}/api/users/me/", headers=headers)
    print(f"Me Status: {me_response.status_code}")

    # 4. Fetch Orders (This is what Dashboard does)
    orders_url = f"{BASE_URL}/api/orders/"
    orders_response = requests.get(orders_url, headers=headers)
    
    if orders_response.status_code == 200:
        print("Fetch Orders: SUCCESS")
        orders = orders_response.json()
        print(f"Orders count: {len(orders)}")
        if len(orders) > 0:
            print("Outputting first order keys to verify structure:")
            print(orders[0].keys())
    else:
        print(f"Fetch Orders FAILED: {orders_response.status_code}")
        print(orders_response.text)

    # Cleanup
    user.delete()

if __name__ == '__main__':
    test_login_flow()
