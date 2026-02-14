import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

def check_staff_profiles():
    # Check all staff members (including superusers)
    staff_members = User.objects.filter(is_staff=True)
    print(f"Checking {staff_members.count()} staff members...")
    
    for staff in staff_members:
        try:
            profile = staff.profile
            print(f"Staff {staff.username} has profile: Yes")
        except UserProfile.DoesNotExist:
            print(f"Staff {staff.username} has NO profile. Creating one...")
            UserProfile.objects.create(user=staff)
            print(f"Created profile for {staff.username}")

if __name__ == '__main__':
    check_staff_profiles()
