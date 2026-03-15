import yagmail
from django.conf import settings

def send_email(to, subject, contents):
    """
    Send an email using yagmail with configured credentials.
    """
    try:
        yag = yagmail.SMTP(settings.YAGMAIL_USER, settings.YAGMAIL_PASSWORD)
        yag.send(to=to, subject=subject, contents=contents)
        print(f"Email sent to {to}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

import razorpay

def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def award_points(user, event_name, custom_points=None, reason_override=None):
    """
    Utility to award points based on RewardRules.
    """
    from .models import RewardRule, RewardTransaction, UserProfile
    
    try:
        rule = RewardRule.objects.get(event_name=event_name)
        if not rule.is_enabled:
            return 0
        
        points = custom_points if custom_points is not None else rule.points
        if points <= 0:
            return 0
            
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.points += points
        
        # Update Tier Logic
        if profile.points >= 3000:
            profile.tier = "Legend Tier" # Matching model choices
        elif profile.points >= 1000:
            profile.tier = "Pro Elite"
        elif profile.points >= 500:
             profile.tier = "Pro Member"
        
        profile.save()
        
        reason = reason_override if reason_override else rule.description
        RewardTransaction.objects.create(
            user=user,
            points_change=points,
            reason=reason
        )
        return points
    except RewardRule.DoesNotExist:
        print(f"No RewardRule found for event: {event_name}")
        return 0
    except Exception as e:
        print(f"Error awarding points: {e}")
        return 0
