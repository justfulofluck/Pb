import yagmail
from django.conf import settings

from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


def send_email(to, subject, contents):
    """
    Send an email using Django's EmailMultiAlternatives.
    Supports both plain text and HTML.
    """
    try:
        from_email = settings.EMAIL_HOST_USER
        text_content = strip_tags(contents)
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        if "<html" in contents.lower():
            msg.attach_alternative(contents, "text/html")
        msg.send()
        print(f"Email sent to {to}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


from django.template.loader import render_to_string


def send_order_confirmation_emails(order, razorpay_payment_id):
    """
    Send order confirmation emails to the customer and the admin using HTML templates.
    """
    from .models import OrderItem

    items = OrderItem.objects.filter(order=order)
    frontend_url = getattr(settings, "FRONTEND_URL", "https://pinobite.com")
    admin_url = getattr(settings, "ADMIN_URL", "https://pinobite.com/admin")

    context = {
        "order": order,
        "items": items,
        "razorpay_payment_id": razorpay_payment_id,
        "frontend_url": frontend_url,
        "admin_url": admin_url,
    }

    # 1. Customer Email
    customer_subject = (
        f"Order Confirmed! Your Pinobite Order #{order.id} is being processed"
    )
    try:
        customer_html = render_to_string("emails/order_confirmation.html", context)
        send_email(order.user_email, customer_subject, customer_html)
    except Exception as e:
        print(f"Error rendering customer email: {e}")
        # Build simple fallback if template fails
        items_list = "\n".join([f"- {i.quantity} x {i.product_name}" for i in items])
        fallback_msg = f"Order Confirmed #{order.id}\nItems:\n{items_list}\nTotal: ₹{order.total_amount}"
        send_email(order.user_email, customer_subject, fallback_msg)

    # 2. Admin Email
    admin_email = getattr(settings, "ADMIN_EMAIL", settings.EMAIL_HOST_USER)
    admin_subject = f"NEW ORDER RECEIVED: #{order.id}"
    try:
        admin_html = render_to_string("emails/admin_order_notification.html", context)
        send_email(admin_email, admin_subject, admin_html)
    except Exception as e:
        print(f"Error rendering admin email: {e}")
        send_email(
            admin_email,
            admin_subject,
            f"New Order Received! Check dashboard for #{order.id}",
        )


import razorpay


def get_razorpay_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


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

        from django.db.models import F

        profile, created = UserProfile.objects.get_or_create(user=user)

        # Atomically increment points in DB
        UserProfile.objects.filter(id=profile.id).update(points=F("points") + points)

        # Refresh to get the actual value for tier calculation
        profile.refresh_from_db()

        # Update Tier Logic
        if profile.points >= 3000:
            profile.tier = "Legend Tier"
        elif profile.points >= 1000:
            profile.tier = "Pro Elite"
        elif profile.points >= 500:
            profile.tier = "Pro Member"

        profile.save(update_fields=["tier"])

        reason = reason_override if reason_override else rule.description
        RewardTransaction.objects.create(user=user, points_change=points, reason=reason)
        return points
    except RewardRule.DoesNotExist:
        print(f"No RewardRule found for event: {event_name}")
        return 0
    except Exception as e:
        print(f"Error awarding points: {e}")
        return 0


def deduct_points(user, points, reason):
    """
    Deduct points from user account.
    Returns (success: bool, message: str)
    """
    from .models import RewardTransaction, UserProfile

    try:
        profile = UserProfile.objects.get(user=user)

        if profile.points < points:
            return False, f"Insufficient points. Available: {profile.points}"

        profile.points -= points
        profile.save(update_fields=["points"])

        RewardTransaction.objects.create(
            user=user, points_change=-points, reason=reason
        )
        return True, f"Redeemed {points} points"
    except UserProfile.DoesNotExist:
        return False, "User profile not found"
    except Exception as e:
        print(f"Error deducting points: {e}")
        return False, str(e)


def cache_get_or_set_fallback(key, default_func, timeout=300, local_timeout=60):
    """
    Get from cache or compute and set with fallback to local memory if Redis fails.

    Args:
        key: Cache key
        default_func: Callable that returns the value if not in cache
        timeout: Redis cache timeout (seconds)
        local_timeout: Local memory cache timeout (seconds)

    Returns:
        Cached or computed value
    """
    from django.core.cache import caches

    # Try Redis cache first
    redis_cache = caches["default"]
    try:
        value = redis_cache.get(key)
        if value is not None:
            return value

        # Compute and store in Redis
        value = default_func()
        redis_cache.set(key, value, timeout=timeout)
        # Also store in local memory as backup
        caches["local_memory"].set(key, value, timeout=local_timeout)
        return value
    except Exception:
        # Redis failed, fallback to local memory
        try:
            value = caches["local_memory"].get(key)
            if value is not None:
                return value
        except Exception:
            pass

        # Compute and store locally only
        value = default_func()
        try:
            caches["local_memory"].set(key, value, timeout=local_timeout)
        except Exception:
            pass
        return value
