
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import RewardRule

RULES = [
    {
        'event_name': 'signup',
        'points': 50,
        'description': 'Welcome bonus for joining Pinobite!'
    },
    {
        'event_name': 'purchase',
        'points': 10,
        'description': 'Earn 10 points for every ₹100 spent'
    },
    {
        'event_name': 'first_order',
        'points': 100,
        'description': 'Special bonus for your very first purchase!'
    },
    {
        'event_name': 'review',
        'points': 20,
        'description': 'Points for sharing your experience with our products'
    },
    {
        'event_name': 'photo_review',
        'points': 50,
        'description': 'Extra points for reviews with photos!'
    },
    {
        'event_name': 'referral',
        'points': 100,
        'description': 'Reward for successfully referring a friend'
    }
]

for rule_data in RULES:
    rule, created = RewardRule.objects.get_or_create(
        event_name=rule_data['event_name'],
        defaults={
            'points': rule_data['points'],
            'description': rule_data['description'],
            'is_enabled': True
        }
    )
    if not created:
        rule.points = rule_data['points']
        rule.description = rule_data['description']
        rule.save()
    print(f"{'Created' if created else 'Updated'} rule: {rule.event_name}")

print("Seeding complete!")
