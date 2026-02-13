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
