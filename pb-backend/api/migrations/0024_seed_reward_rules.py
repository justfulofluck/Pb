from django.db import migrations

def seed_reward_rules(apps, schema_editor):
    RewardRule = apps.get_model('api', 'RewardRule')
    
    RULES = [
        ("signup", "Signup Reward", 50),
        ("first_order", "First Order Bonus", 150),
        ("purchase", "Spend-based Points (per ₹100)", 10),
        ("review", "Product Review", 50),
        ("photo_review", "Photo Review Reward", 75),
        ("birthday", "Birthday Reward", 200),
        ("instagram_follow", "Instagram Follow", 30),
        ("social_share", "Social Media Share", 20),
        ("referral", "Referral Reward", 100),
    ]

    for event, desc, points in RULES:
        RewardRule.objects.get_or_create(
            event_name=event,
            defaults={'description': desc, 'points': points}
        )

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_delete_pressupdate'),
    ]

    operations = [
        migrations.RunPython(seed_reward_rules),
    ]
