import django
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from django.contrib.auth.models import User
from .models import BlogPost, NewsletterSubscriber, UserProfile
from .utils import send_email


from django.template.loader import render_to_string

@receiver(post_save, sender=BlogPost)
def send_newsletter_on_new_blog(sender, instance, created, **kwargs):
    if not created:
        return

    subscribers = NewsletterSubscriber.objects.filter(is_active=True)
    if not subscribers.exists():
        return

    blog_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    blog_link = f"{blog_url}/blogs/{instance.id}"
    subject = f"New on Pinobite: {instance.title}"

    for subscriber in subscribers:
        context = {
            'instance': instance,
            'blog_link': blog_link,
            'blog_url': blog_url,
            'email': subscriber.email
        }
        try:
            html_content = render_to_string('emails/newsletter_blog.html', context)
            send_email(subscriber.email, subject, html_content)
        except Exception as e:
            print(f"Failed to send newsletter to {subscriber.email}: {e}")

@receiver(post_save, sender=User)
def handle_user_onboarding(sender, instance, created, **kwargs):
    # 1. Ensure Profile Exists
    if created:
        UserProfile.objects.get_or_create(user=instance)
    elif not hasattr(instance, "profile"):
        UserProfile.objects.create(user=instance)

    from .utils import award_points

    # 2. Send Welcome Email on Creation
    if created:
        award_points(instance, "signup")
        try:
            subject = "Welcome to the Pinobite Club! 🍿"
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            
            context = {
                'user': instance,
                'frontend_url': frontend_url
            }
            html_message = render_to_string('emails/welcome_email.html', context)
            send_email(instance.email, subject, html_message)
        except Exception as e:
            print(f"Failed to send welcome email to {instance.email}: {e}")
