from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name


from django.utils.text import slugify


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    gallery = models.JSONField(default=list, blank=True)
    description = models.TextField()
    benefits = models.JSONField(default=list, blank=True)
    nutrients = models.JSONField(default=list, blank=True)  # List of {label, value}
    ingredients = models.TextField(blank=True, null=True)
    ingredients_list = models.JSONField(default=list, blank=True)  # List of {name, image}
    is_top_rated = models.BooleanField(default=False, db_index=True)
    category = models.CharField(
        max_length=100, db_index=True
    )  # Or foreign key to Category
    stock = models.IntegerField(default=0)
    model_3d = models.FileField(upload_to='models_3d/', blank=True, null=True)
    theme_color = models.CharField(max_length=50, blank=True, null=True)
    orientation = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class UsageIdea(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="usage_ideas"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='usage_ideas/', null=True, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} for {self.product.name}"


class Review(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True
    )
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="reviews", null=True, blank=True
    )
    product_id_str = models.CharField(
        max_length=50, default="general"
    )  # 'general' or specific ID
    user_name = models.CharField(max_length=255)
    user_role = models.CharField(max_length=255)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    date = models.DateField()  # Matching frontend string date
    avatar = models.URLField(max_length=1000)

    def __str__(self):
        return f"{self.user_name} - {self.rating}"


class Event(models.Model):
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    summary = models.TextField()
    full_story = models.JSONField(default=list)  # List of {heading, content}
    gallery = models.JSONField(default=list)
    featured_products = models.JSONField(default=list)  # List of product IDs
    date = models.DateField()
    impact_participants = models.CharField(max_length=100, blank=True, null=True)
    fuel_bars_shared = models.CharField(max_length=100, blank=True, null=True)
    vibe_energy = models.CharField(max_length=100, blank=True, null=True)
    scheduled_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return self.title


class BlogPost(models.Model):
    TYPE_CHOICES = [
        ("Recipe", "Recipe"),
        ("Lifestyle", "Lifestyle"),
        ("News", "News"),
    ]
    post_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt = models.TextField()
    image = models.ImageField(upload_to='blog/', null=True, blank=True)
    date = models.DateField()
    read_time = models.CharField(max_length=20, blank=True, default='')
    author = models.CharField(max_length=100)
    content = models.JSONField(default=list)  # List of paragraphs
    tags = models.JSONField(default=list, blank=True)
    scheduled_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)

    # New Editorial Fields
    subtitle = models.CharField(max_length=500, blank=True, null=True)
    intro_heading = models.CharField(max_length=500, blank=True, null=True)
    featured_quote = models.TextField(blank=True, null=True)
    author_image = models.ImageField(upload_to='blog/authors/', blank=True, null=True)
    author_role = models.CharField(max_length=100, blank=True, null=True)
    secondary_image = models.ImageField(upload_to='blog/extra/', blank=True, null=True)
    tertiary_image = models.ImageField(upload_to='blog/extra/', blank=True, null=True)
    facts_list = models.JSONField(default=list, blank=True)
    key_points = models.JSONField(default=list, blank=True)
    health_benefits = models.JSONField(default=list, blank=True)
    usage_recipes = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Story(models.Model):
    MEDIA_TYPE_CHOICES = [
        ("image", "image"),
        ("video", "video"),
    ]
    media_url = models.FileField(upload_to='stories/', blank=True, null=True)
    poster_url = models.ImageField(upload_to='stories/posters/', blank=True, null=True)
    original_drive_url = models.URLField(max_length=1000, blank=True, null=True)
    full_video_url = models.FileField(upload_to='stories/full/', blank=True, null=True)
    media_type = models.CharField(
        max_length=10, choices=MEDIA_TYPE_CHOICES, db_index=True
    )
    product_id = models.CharField(max_length=50, db_index=True)

    def __str__(self):
        return f"Story {self.id} for {self.product_id}"


class HeroSlide(models.Model):
    category = models.CharField(max_length=100)
    headline = models.CharField(max_length=255)
    image = models.ImageField(upload_to='hero/', null=True, blank=True)
    cta = models.CharField(max_length=50)  # Primary button text
    cta_link = models.CharField(max_length=255, blank=True, null=True)
    secondary_cta = models.CharField(max_length=50, blank=True, null=True)
    secondary_cta_link = models.CharField(max_length=255, blank=True, null=True)
    bg_color = models.CharField(max_length=50)
    accent_color = models.CharField(max_length=50)
    blob_color = models.CharField(max_length=50)
    product_id = models.CharField(
        max_length=50, blank=True, null=True
    )  # ID of the linked product
    transition_type = models.CharField(
        max_length=50, default="fade"
    )  # fade, slide, scale, etc.
    order = models.IntegerField(default=0)
    background_image = models.ImageField(upload_to='hero/bg/', blank=True, null=True)
    mobile_image = models.ImageField(upload_to='hero/mobile/', blank=True, null=True)
    display_duration = models.IntegerField(default=5)  # Duration in seconds
    is_active = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return self.headline


class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    user_email = models.EmailField()
    phone = models.CharField(max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=20)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING", db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} - {self.user_email}"


class RewardRule(models.Model):
    EVENT_CHOICES = [
        ("signup", "Signup Reward"),
        ("first_order", "First Order Bonus"),
        ("purchase", "Spend-based Points (per ₹100)"),
        ("review", "Product Review"),
        ("photo_review", "Photo Review Reward"),
        ("birthday", "Birthday Reward"),
        ("instagram_follow", "Instagram Follow"),
        ("social_share", "Social Media Share"),
        ("referral", "Referral Reward"),
    ]
    event_name = models.CharField(max_length=50, choices=EVENT_CHOICES, unique=True)
    points = models.IntegerField(default=0)
    is_enabled = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_event_name_display()} - {self.points} pts"


class RewardTransaction(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reward_transactions"
    )
    points_change = models.IntegerField()
    reason = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.points_change} pts for {self.reason}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)  # Snapshot of name at order time
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"


class UserProfile(models.Model):
    TIER_CHOICES = [
        ("Member", "Member"),
        ("Pro Member", "Pro Member"),
        ("Pro Elite", "Pro Elite"),
        ("Legend Tier", "Legend Tier"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    points = models.IntegerField(default=0)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default="Member")
    savings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pin_code = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


class VisitorForm(models.Model):
    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Published", "Published"),
    ]
    title = models.CharField(max_length=255)
    event_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Draft")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class VisitorSubmission(models.Model):
    form = models.ForeignKey(
        VisitorForm, related_name="submissions", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address_details = models.CharField(max_length=255, default="")
    buying_source = models.CharField(max_length=50, default="")
    brand_awareness = models.BooleanField(default=False)
    current_usage = models.CharField(max_length=255, default="")
    flavor_preferences = models.TextField(default="")
    reviewed_product = models.CharField(max_length=100, default="")
    review_content = models.TextField(default="")
    marketing_consent = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.form.title}"


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.IntegerField(default=0)

    def is_valid(self):
        from django.utils import timezone
        import datetime

        return self.created_at >= timezone.now() - datetime.timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.user.username}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return self.email


class Announcement(models.Model):
    message = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Announcement {self.id}: {self.message[:50]}..."


class DistributorApplication(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]
    business_name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.business_name} - {self.full_name}"


class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="wishlisted_by"
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class WishlistShareLink(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="shared_wishlists"
    )
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Share link for {self.user.username} - {self.token[:8]}"
