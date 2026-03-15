from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductListSerializer(serializers.ModelSerializer):
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
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = "__all__"


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = "__all__"


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_product_image(self, obj):
        if obj.product:
            return obj.product.image
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
    class Meta:
        model = UserProfile
        fields = [
            "points",
            "tier",
            "savings",
            "phone",
            "address",
            "city",
            "state",
            "pin_code",
            "birth_date",
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
            profile.save()
            
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
