import django
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import BlogPost, NewsletterSubscriber
from .utils import send_email


@receiver(post_save, sender=BlogPost)
def send_newsletter_on_new_blog(sender, instance, created, **kwargs):
    if not created:
        return

    subscribers = NewsletterSubscriber.objects.filter(is_active=True)
    if not subscribers.exists():
        return

    blog_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    blog_link = f"{blog_url}/blogs/{instance.id}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }}
            .header {{ background-color: #008a45; padding: 40px 20px; text-align: center; }}
            .logo {{ color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }}
            .logo span {{ color: #1a2333; }}
            .content {{ padding: 40px 30px; color: #333333; }}
            .greeting {{ font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1a2333; }}
            .blog-title {{ font-size: 24px; font-weight: 800; color: #008a45; margin-bottom: 15px; text-transform: uppercase; }}
            .blog-excerpt {{ line-height: 1.8; color: #555555; margin-bottom: 30px; font-size: 16px; }}
            .blog-image {{ width: 100%; border-radius: 8px; margin-bottom: 30px; }}
            .cta-button {{ display: inline-block; background-color: #008a45; color: #ffffff; padding: 15px 40px; text-decoration: none; font-weight: 800; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; }}
            .footer {{ background-color: #1a2333; padding: 30px 20px; text-align: center; font-size: 12px; color: #888888; }}
            .footer a {{ color: #008a45; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Pino<span>bite</span></div>
            </div>
            <div class="content">
                <div class="greeting">New Article Alert!</div>
                <img src="{instance.image}" alt="{instance.title}" class="blog-image" />
                <div class="blog-title">{instance.title}</div>
                <div class="blog-excerpt">{instance.excerpt}</div>
                <div style="text-align: center;">
                    <a href="{blog_link}" class="cta-button">Read Full Article</a>
                </div>
            </div>
            <div class="footer">
                <p>You received this email because you subscribed to Pinobite newsletter.</p>
                <p><a href="{blog_url}/unsubscribe?email={{email}}">Unsubscribe</a> | <a href="{blog_url}">Visit Website</a></p>
                <p style="margin-top: 20px;">&copy; 2026 Pinobite Global. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    subject = f"New on Pinobite: {instance.title}"

    for subscriber in subscribers:
        personalized_html = html_content.replace("{email}", subscriber.email)
        try:
            send_email(subscriber.email, subject, personalized_html)
        except Exception as e:
            print(f"Failed to send newsletter to {subscriber.email}: {e}")
