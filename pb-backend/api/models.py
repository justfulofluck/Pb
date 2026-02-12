from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.TextField()

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    image = models.TextField()
    gallery = models.JSONField(default=list, blank=True)
    description = models.TextField()
    benefits = models.JSONField(default=list, blank=True)
    nutrients = models.JSONField(default=list, blank=True) # List of {label, value}
    is_top_rated = models.BooleanField(default=False)
    category = models.CharField(max_length=100) # Or foreign key to Category
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    product_id_str = models.CharField(max_length=50, default='general') # 'general' or specific ID
    user_name = models.CharField(max_length=255)
    user_role = models.CharField(max_length=255)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    date = models.CharField(max_length=50) # Matching frontend string date
    avatar = models.URLField(max_length=1000)

    def __str__(self):
        return f"{self.user_name} - {self.rating}"

class Event(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    image = models.TextField()
    summary = models.TextField()
    full_story = models.JSONField(default=list) # List of {heading, content}
    gallery = models.JSONField(default=list)
    featured_products = models.JSONField(default=list) # List of product IDs
    date = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class BlogPost(models.Model):
    TYPE_CHOICES = [
        ('Recipe', 'Recipe'),
        ('Lifestyle', 'Lifestyle'),
        ('News', 'News'),
    ]
    post_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    image = models.TextField()
    date = models.CharField(max_length=50)
    read_time = models.CharField(max_length=20)
    author = models.CharField(max_length=100)
    content = models.JSONField(default=list) # List of paragraphs
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title

class Story(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'image'),
        ('video', 'video'),
    ]
    media_url = models.TextField()
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    product_id = models.CharField(max_length=50)

    def __str__(self):
        return f"Story {self.id} for {self.product_id}"

class HeroSlide(models.Model):
    category = models.CharField(max_length=100)
    headline = models.CharField(max_length=255)
    description = models.TextField()
    image = models.TextField()
    cta = models.CharField(max_length=50)
    bg_color = models.CharField(max_length=50)
    accent_color = models.CharField(max_length=50)
    blob_color = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.headline

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    user_email = models.EmailField()
    phone = models.CharField(max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=20)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} - {self.user_email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255) # Snapshot of name at order time
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"

class UserProfile(models.Model):
    TIER_CHOICES = [
        ('Member', 'Member'),
        ('Pro Member', 'Pro Member'),
        ('Pro Elite', 'Pro Elite'),
        ('Legend Tier', 'Legend Tier'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    points = models.IntegerField(default=0)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='Member')
    savings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if not hasattr(instance, 'profile'):
        UserProfile.objects.create(user=instance)
    instance.profile.save()

class VisitorForm(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
    ]
    title = models.CharField(max_length=255)
    event_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class VisitorSubmission(models.Model):
    form = models.ForeignKey(VisitorForm, related_name='submissions', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.form.title}"
