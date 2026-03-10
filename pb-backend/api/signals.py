import django
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from django.contrib.auth.models import User
from .models import BlogPost, NewsletterSubscriber, UserProfile
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

@receiver(post_save, sender=User)
def handle_user_onboarding(sender, instance, created, **kwargs):
    # 1. Ensure Profile Exists
    if created:
        UserProfile.objects.get_or_create(user=instance)
    elif not hasattr(instance, "profile"):
        UserProfile.objects.create(user=instance)
    
    instance.profile.save()

    # 2. Send Welcome Email on Creation
    if created:
        try:
            subject = "Welcome to the Pinobite Club! 🍿"
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
            
            # Beautiful HTML welcome template
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to Pinobite</title>
                <style>
body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
.container {{ max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
.header {{ background-color: #008a45; padding: 40px 20px; text-align: center; }}
.logo {{ color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }}
.logo span {{ color: #1a2333; }}
.hero-section {{ padding: 50px 30px; text-align: center; background: linear-gradient(135deg, #008a45 0%, #007038 100%); color: white; }}
.content {{ padding: 40px 30px; color: #333333; }}
.greeting {{ font-size: 24px; font-weight: 800; margin-bottom: 15px; color: #1a2333; text-align: center; }}
.message {{ line-height: 1.8; margin-bottom: 25px; color: #555555; font-size: 16px; text-align: center; }}
.feature-box {{ background-color: #f0fdf4; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #dcfce7; }}
.feature-title {{ font-size: 18px; font-weight: 800; color: #166534; margin-bottom: 15px; text-transform: uppercase; text-align: center; }}
.feature-list {{ margin: 0; padding: 0; list-style: none; }}
.feature-item {{ margin-bottom: 12px; padding-left: 30px; position: relative; color: #166534; font-weight: 600; font-size: 15px; }}
.feature-item::before {{ content: '✅'; position: absolute; left: 0; top: 0; }}
.cta-button {{ display: block; background-color: #008a45; color: #ffffff; padding: 18px 45px; text-decoration: none; font-weight: 800; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0,138,69,0.3); text-align: center; margin: 40px auto; max-width: 250px; }}
.footer {{ background-color: #1a2333; padding: 40px 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }}
.footer a {{ color: #008a45; text-decoration: none; font-weight: bold; }}
.social-links {{ margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Pino<span>bite</span></div>
                    </div>
                    <div class="hero-section">
                        <h1 style="margin:0; font-size: 38px; font-weight: 900; letter-spacing: -1px;">YOU'RE IN! 🚀</h1>
                        <p style="font-size: 18px; opacity: 0.9; margin-top: 10px;">Welcome to the healthier side of life.</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Hello {instance.first_name if instance.first_name else instance.username},</div>
                        <div class="message">
                            We're absolutely thrilled to have you join the <strong>Pinobite Club</strong>! You've just taken the first step towards a more energized, nutritious, and delicious lifestyle.
                        </div>
                        
                        <div class="feature-box">
                            <div class="feature-title">Your Member Perks 🎁</div>
                            <div class="feature-list">
                                <div class="feature-item">Exclusive Rewards: Earn points on every purchase.</div>
                                <div class="feature-item">Early Access: Be the first to try new flavors.</div>
                                <div class="feature-item">Nutritional Coaching: Pro Tips for active lifestyle.</div>
                            </div>
                        </div>
                        
                        <div class="message" style="margin-bottom: 10px;">
                            Ready to explore the world of premium nut butters and healthy snacks? Your journey starts here.
                        </div>
                        
                        <a href="{frontend_url}" class="cta-button">START SHOPPING</a>
                    </div>
                    <div class="footer">
                        <div class="social-links">
                            Follow the journey: <a href="https://instagram.com/pinobite">Instagram</a> | <a href="https://facebook.com/pinobite">Facebook</a>
                        </div>
                        <p>&copy; 2026 Pinobite Global. All rights reserved.</p>
                        <p>Mumbai, India | hello@pinobite.global</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            send_email(instance.email, subject, html_message)
        except Exception as e:
            print(f"Failed to send welcome email to {instance.email}: {e}")
