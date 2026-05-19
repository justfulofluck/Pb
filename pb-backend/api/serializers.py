from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.files.base import ContentFile
import base64
import uuid
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    Category,
    Product,
    Review,
    Event,
    BlogPost,
    Story,
    HeroSlide,
    Order,
    OrderItem,
    UserProfile,
    VisitorForm,
    VisitorSubmission,
    NewsletterSubscriber,
    Announcement,
    DistributorApplication,
    RewardRule,
    RewardTransaction,
    WishlistItem,
    WishlistShareLink,
    UsageIdea,
)


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True, required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("username", None)
        self.fields["email"] = serializers.EmailField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email=email).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        attrs["username"] = user.username
        return super().validate(attrs)


class FlexibleFileField(serializers.FileField):
    """
    Custom field that handles both file uploads and existing paths on the server,
    as well as Base64 encoded files.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            # Handle Base64
            if data.startswith('data:'):
                try:
                    format_part, filestr = data.split(';base64,')
                    mime_type = format_part.split(':')[-1]
                    ext = mime_type.split('/')[-1]
                    ext_map = {
                        'gltf-binary': 'glb',
                        'gltf+json': 'gltf',
                        'octet-stream': 'glb'
                    }
                    ext = ext_map.get(ext, ext)
                    raw_bytes = base64.b64decode(filestr)
                    # Validate GLB file header to detect truncated/corrupted uploads
                    if ext == 'glb' and len(raw_bytes) >= 12:
                        if raw_bytes[:4] != b'glTF':
                            raise serializers.ValidationError("Invalid GLB file: missing glTF header")
                        declared_len = int.from_bytes(raw_bytes[8:12], 'little')
                        if declared_len > len(raw_bytes):
                            raise serializers.ValidationError(
                                f"GLB file truncated: header declares {declared_len} bytes, "
                                f"received {len(raw_bytes)}"
                            )
                    file_name = f"{uuid.uuid4()}.{ext}"
                    data = ContentFile(raw_bytes, name=file_name)
                    return super().to_internal_value(data)
                except serializers.ValidationError:
                    raise
                except Exception as e:
                    raise serializers.ValidationError(f"Failed to decode file: {e}")

            # If it's a full URL or absolute path starting with MEDIA_URL, strip it
            from django.conf import settings
            media_url = settings.MEDIA_URL
            if data.startswith(media_url):
                return data[len(media_url):]
            if '://' in data:
                from urllib.parse import urlparse
                path = urlparse(data).path
                if path.startswith(media_url):
                    return path[len(media_url):]
            return data
        return super().to_internal_value(data)


class FlexibleImageField(serializers.ImageField):
    """
    Custom field that handles both image uploads and existing paths on the server,
    as well as Base64 encoded images.
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            if data.startswith('data:'):
                try:
                    format_part, imgstr = data.split(';base64,')
                    mime_type = format_part.split(':')[-1]
                    ext = mime_type.split('/')[-1]
                    ext_map = {
                        'jpeg': 'jpg',
                        'svg+xml': 'svg'
                    }
                    ext = ext_map.get(ext, ext)
                    file_name = f"{uuid.uuid4()}.{ext}"
                    raw_bytes = base64.b64decode(imgstr)
                    data = ContentFile(raw_bytes, name=file_name)
                    return super().to_internal_value(data)
                except serializers.ValidationError:
                    raise
                except Exception as e:
                    raise serializers.ValidationError(f"Failed to decode image: {e}")

            from django.conf import settings
            media_url = settings.MEDIA_URL
            if data.startswith(media_url):
                return data[len(media_url):]
            if '://' in data:
                from urllib.parse import urlparse
                path = urlparse(data).path
                if path.startswith(media_url):
                    return path[len(media_url):]
            return data
        return super().to_internal_value(data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class UsageIdeaSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = UsageIdea
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)
    model_3d = FlexibleFileField(required=False, allow_null=True)
    usage_ideas = UsageIdeaSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


class ProductListSerializer(serializers.ModelSerializer):
    usage_ideas = UsageIdeaSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "original_price",
            "rating",
            "review_count",
            "image",
            "category",
            "stock",
            "is_top_rated",
            "theme_color",
            "description",
            "benefits",
            "ingredients",
            "ingredients_list",
            "model_3d",
            "orientation",
            "usage_ideas",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = "__all__"


class BlogPostSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)
    author_image = FlexibleImageField(required=False, allow_null=True)
    secondary_image = FlexibleImageField(required=False, allow_null=True)
    tertiary_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = "__all__"

    def to_internal_value(self, data):
        """Normalize content and tags before validation."""
        # Normalize content: string -> list of strings
        if "content" in data:
            content = data["content"]
            if isinstance(content, str):
                data["content"] = [p.strip() for p in content.split("\n\n") if p.strip()]
            elif not isinstance(content, list):
                data["content"] = []

        # Normalize/Validate tags
        if "tags" in data:
            tags = data["tags"]
            if isinstance(tags, str):
                # Handle comma-separated string if provided
                tags = [t.strip() for t in tags.split(",") if t.strip()]
                data["tags"] = tags
            
            if not isinstance(data.get("tags"), list):
                # Only raise if it's explicitly provided but wrong type
                if "tags" in data:
                     raise serializers.ValidationError({"tags": "Tags must be a list or comma-separated string"})

        return super().to_internal_value(data)

    def to_representation(self, instance):
        """Convert list content to string for frontend editing."""
        data = super().to_representation(instance)
        if isinstance(data.get("content"), list):
            data["content"] = "\n\n".join(str(p) for p in data["content"])
        return data






class StorySerializer(serializers.ModelSerializer):
    media_url = FlexibleFileField(use_url=True)
    poster_url = FlexibleImageField(use_url=True, required=False, allow_null=True)
    full_video_url = FlexibleFileField(use_url=True, required=False, allow_null=True)
    original_drive_url = serializers.URLField(required=False, allow_null=True)
    product_id = serializers.CharField()
    media_type = serializers.CharField(required=False)

    class Meta:
        model = Story
        fields = ["id", "media_url", "poster_url", "full_video_url", "original_drive_url", "product_id", "media_type"]


class HeroSlideSerializer(serializers.ModelSerializer):
    image = FlexibleImageField(required=False, allow_null=True)
    background_image = FlexibleImageField(required=False, allow_null=True)
    mobile_image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = HeroSlide
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            try:
                return obj.product.image.url
            except ValueError:
                return None
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.ReadOnlyField(source="user.username")
    user_email = serializers.ReadOnlyField(source="user.email")

    class Meta:
        model = Order
        fields = "__all__"
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    tier_benefits = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "points",
            "tier",
            "savings",
            "tier_benefits",
            "phone",
            "address",
            "city",
            "state",
            "pin_code",
            "birth_date",
        ]

    def get_tier_benefits(self, obj):
        return "coming soon"


class CustomerManagementSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile",
            "is_active",
            "is_staff",
            "date_joined",
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    birth_date = serializers.DateField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "profile",
            "is_staff",
            "phone",
            "birth_date",
        ]

    def create(self, validated_data):
        phone = validated_data.pop("phone", None)
        birth_date = validated_data.pop("birth_date", None)

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        if phone or birth_date:
            profile = user.profile
            if phone:
                profile.phone = phone
            if birth_date:
                profile.birth_date = birth_date
            profile.save(update_fields=["phone", "birth_date"])

        return user


class VisitorSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorSubmission
        fields = "__all__"


class VisitorFormSerializer(serializers.ModelSerializer):
    submissions = VisitorSubmissionSerializer(many=True, read_only=True)

    class Meta:
        model = VisitorForm
        fields = ["id", "title", "event_name", "status", "created_at", "submissions"]


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class SetNewPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8)


class NewsletterSubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["id", "email", "subscribed_at", "is_active"]
        read_only_fields = ["id", "subscribed_at"]


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"


class DistributorApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorApplication
        fields = "__all__"


class RewardRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardRule
        fields = "__all__"


class RewardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardTransaction
        fields = "__all__"


class WishlistItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "user", "product", "product_details", "added_at"]
        read_only_fields = ["user", "added_at"]


class WishlistShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistShareLink
        fields = ["id", "user", "token", "created_at", "expires_at", "is_active"]
        read_only_fields = ["user", "token", "created_at"]
